import io from 'socket.io-client'
import {
  prop,
  pipe,
  values,
  keys,
  not,
} from 'ramda'
import {
  eventChannel
} from 'redux-saga'
import {
  fork,
  takeEvery,
  take,
  put,
  call,
  select,
  all,
  race,
  takeLatest,
  delay,
} from "@redux-saga/core/effects";
import { 
  createActions 
} from 'redux-actions'
import { 
  show, 
  hide,
} from 'redux-modal';
import * as selectors  from '../selectors'

import actions, { enqueueSnackbar } from '../actions'

const success = (payload) => enqueueSnackbar({
  ...payload,
  options: {
    key: new Date().getTime() + Math.random(),
    variant: "success",
  }
})

const info = (payload) => enqueueSnackbar({
  ...payload,
  options: {
    key: new Date().getTime() + Math.random(),
    variant: "info",
  }
})

const warning = (payload) => enqueueSnackbar({
  ...payload,
  options: {
    key: new Date().getTime() + Math.random(),
    variant: "warning",
  }
})

const error = (payload) => enqueueSnackbar({
  ...payload,
  options: {
    key: new Date().getTime() + Math.random(),
    variant: "error",
  }
})

const notifications = {
  CONNECTION: info({
    message: 'Server connected! Online multiplayer available',
  }),
  DISCONNECTION: warning({
    message: 'Server disconnected. Online multiplayer unavailable',
  }),
  ROOM_ENDED: error({
    message: `Opponent lefted game`,
  }),
  ENDED_ROOM: warning({
    message: `You lefted game`,
  }),
  STARTED_ROOM: info({
    message: `You started a game. Waiting for someone to join`,
  }),
  JOINED_ROOM: success({
    message: `You joined a game! Opponent's turn`,
  }),
  ROOM_JOINED: success({
    message: `Someone joined your game! Your turn`,
  }),
  REMATCH: success({
    message: `Rematch!`,
  }),
}

function* notificationsSaga() {

  yield takeEvery(keys(notifications), function* (action) {
    yield put(prop(action.type, notifications))
  })
}

function* joinRoomSaga(socket) {
  yield takeLatest('JOIN_ROOM', function* () {
    yield put(show('joinRoom', createActions({ CANCEL: undefined, SUBMIT: roomId => roomId,})))
    yield takeEvery('SUBMIT', function* ({payload: roomId}) {
      socket.emit('joinRoom', roomId)
    })
    yield take(['DISCONNECTION', 'CANCEL', 'JOINED_ROOM'])
    yield put(hide('joinRoom'))
  })
}

function* startRoomSaga(socket) {
  yield takeLatest('START_ROOM', function* () {
    yield put(show('startRoom', createActions({CANCEL: undefined,})))
    socket.emit('startRoom')
    yield race([
      take(['DISCONNECTION', 'ROOM_JOINED']),
      call(function* () {
        yield take('CANCEL')
        socket.emit('leaveRoom')
      })
    ])
    yield put(hide('startRoom'))
  })
}

function* leaveRoomSaga(socket) {
  yield takeLatest('LEAVE_ROOM', function* () {
    socket.emit('leaveRoom')
  })
}

function* inGameSaga(socket) {
  yield takeEvery(['DROP_DISC', 'REQUEST_REMATCH'], function* (action) {
    socket.emit('socketAction', action)
  })
  yield fork(function* () {
    while(true) {
      yield all([
        take('REQUEST_REMATCH'),
        call(function * (){ 
          while(true) {
            const {payload: socketAction} = yield take('SOCKET_ACTION')
            if(socketAction.type === 'REQUEST_REMATCH') {
              if(not(yield select(selectors.isWaitingForRematch))) {
                yield put(info({
                  message: 'Opponent wants a rematch!',
                }))
              }
              break;
            }
          }
        })
      ])
      yield put(actions.rematch())
    }
  })
}


const createSocketChannel = (socket) => eventChannel(emit => {
  values(actions).forEach(action => {
    socket.on(action, pipe(action, emit))
  })
  socket.on('connect', pipe(actions.connection, emit))
  socket.on('disconnect', pipe(actions.disconnection, emit))
  return () => {}
})

function* readSocketSaga(socket) {
  yield fork(function* () {
    const channel = yield call(createSocketChannel, socket)
    while(true) {
      const socketAction = yield take(channel)
      yield put(socketAction)
    }
  })
}

function* socketSaga() {
  const socket = io('')
  yield* readSocketSaga(socket)
  yield* notificationsSaga()
  yield* joinRoomSaga(socket)
  yield* startRoomSaga(socket)
  yield* leaveRoomSaga(socket)
  yield* inGameSaga(socket)
}

export default socketSaga
