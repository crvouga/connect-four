import io from "socket.io-client";
import { prop, pipe, values, keys, not } from "ramda";
import { eventChannel } from "redux-saga";
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
import { createActions } from "redux-actions";
import { show, hide } from "redux-modal";
import * as selectors from "../selectors";

import actions from "../actions";

const { success, info, warning, error } = actions;

const notifications = {
  CONNECTION: success({
    message: "Server connected! 😊",
  }),
  DISCONNECTION: error({
    message: "Server disconnected 😑",
  }),
  ROOM_ENDED: error({
    message: `Opponent lefted game 👋`,
  }),
  ENDED_ROOM: info({
    message: `You lefted game 👋`,
  }),
  STARTED_ROOM: info({
    message: `You started a game. 🌐`,
  }),
  JOINED_ROOM: success({
    message: `You joined someone's game! ⚔️`,
  }),
  ROOM_JOINED: success({
    message: `Someone joined your game! ⚔️`,
  }),
  REMATCH: success({
    message: `Rematch! ⚔️`,
  }),
  opponentWantsRematch: info({
    message: "Opponent wants a rematch! 🆚",
  }),
};

function* notificationsSaga() {
  yield takeEvery(keys(notifications), function* (action) {
    yield put(prop(action.type, notifications));
  });
}

function* joinRoomSaga(socket) {
  yield takeLatest("JOIN_ROOM", function* () {
    yield put(
      show(
        "joinRoom",
        createActions({ CANCEL: undefined, SUBMIT: (roomId) => roomId })
      )
    );
    yield takeEvery("SUBMIT", function* ({ payload: roomId }) {
      socket.emit("joinRoom", roomId);
    });
    yield take(["DISCONNECTION", "CANCEL", "JOINED_ROOM"]);
    yield put(hide("joinRoom"));
  });
}

function* startRoomSaga(socket) {
  yield takeLatest("START_ROOM", function* () {
    yield put(show("startRoom", createActions({ CANCEL: undefined })));
    socket.emit("startRoom");
    yield race([
      take(["DISCONNECTION", "ROOM_JOINED"]),
      call(function* () {
        yield take("CANCEL");
        socket.emit("leaveRoom");
      }),
    ]);
    yield put(hide("startRoom"));
  });
}

function* leaveRoomSaga(socket) {
  yield takeLatest("LEAVE_ROOM", function* () {
    socket.emit("leaveRoom");
  });
}

function* inGameSaga(socket) {
  yield takeEvery(["DROP_DISC", "REQUEST_REMATCH"], function* (action) {
    socket.emit("socketAction", action);
  });
  yield fork(function* () {
    while (true) {
      yield all([
        take("REQUEST_REMATCH"),
        call(function* () {
          while (true) {
            const { payload: socketAction } = yield take("SOCKET_ACTION");
            if (socketAction.type === "REQUEST_REMATCH") {
              if (not(yield select(selectors.isWaitingForRematch))) {
                yield put(notifications.opponentWantsRematch);
              }
              break;
            }
          }
        }),
      ]);
      yield put(actions.rematch());
    }
  });
}

const createSocketChannel = (socket) =>
  eventChannel((emit) => {
    values(actions).forEach((action) => {
      socket.on(action, pipe(action, emit));
    });
    socket.on("connect", pipe(actions.connection, emit));
    socket.on("disconnect", pipe(actions.disconnection, emit));
    return () => {};
  });

function* readSocketSaga(socket) {
  yield fork(function* () {
    const channel = yield call(createSocketChannel, socket);
    while (true) {
      const socketAction = yield take(channel);
      yield put(socketAction);
    }
  });
}

const IS_IN_DEVELOPMENT_MODE =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const socketURL = "https://connect-four-backend.herokuapp.com/";
// IS_IN_DEVELOPMENT_MODE
// ? "http://localhost:8080/"
// : "https://connect-four-backend.herokuapp.com/";

function* socketSaga() {
  const socket = io(socketURL);
  yield* readSocketSaga(socket);
  yield* notificationsSaga();
  yield* joinRoomSaga(socket);
  yield* startRoomSaga(socket);
  yield* leaveRoomSaga(socket);
  yield* inGameSaga(socket);
}

export default socketSaga;
