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
  cancel,
} from "@redux-saga/core/effects";
import { 
  createActions 
} from 'redux-actions'
import { 
  show, 
  hide,
} from 'redux-modal';
import { 
  success, 
  error, 
  info,
} from 'react-notification-system-redux'
import * as selectors  from '../selectors'
import actions from '../actions'

const notifications = {
  CONNECTION: success({
    title: 'Server connection',
    message: 'Online multiplayer is available',
    position: 'bc',
  }),
  DISCONNECTION: info({
    title: 'Server disconnection',
    message: 'Online multiplayer is unavailable',
    position: 'bc',
  }),
  ROOM_ENDED: error({
    title: `Opponent has lefted the game`,
    position: 'tc',
  }),
  ENDED_ROOM: info({
    title: `You have lefted the game`,
    position: 'bc',
  }),
  STARTED_ROOM: info({
    title: `Started a game`,
    message: `Waiting for an opponent to join`,
    position: 'bc',
  }),
  JOINED_ROOM: success({
    title: `You joined a game!`,
    message: `Opponent's turn`,
    position: 'tc',
  }),
  ROOM_JOINED: success({
    title: `Opponent joined your game!`,
    message: `Your turn`,
    position: 'tc',
  }),
  REMATCH: success({
    title: 'Rematch!',
    message: `Winner goes first`,
    position: 'tc',
  }),
  SOCKET_REQUEST_RESTART_GAME: info({
    title: `Opponent wants to rematch`,
    position: 'tc',
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
                  title: 'Opponent wants a rematch!',
                  position: 'tc',
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
