import {
  all,
  call,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
  takeLatest,
} from "@redux-saga/core/effects";
import { not, pipe, values } from "ramda";
import { createActions } from "redux-actions";
import { hide, show } from "redux-modal";
import { eventChannel } from "redux-saga";
import io from "socket.io-client";
import actions from "../actions";
import * as selectors from "../selectors";
import notificationsSaga from "./notifications";

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
  yield takeLatest(["CONNECTION", "DISCONNECTION", "LEAVE_ROOM"], function* () {
    socket.emit("leaveRoom");
  });
}

function* inGameSaga(socket) {
  yield takeEvery(["CONNECTION", "SOCKET_ACTION"], function* () {
    const role = yield select((state) => state.game.role);
    if (role === "host") {
      const gameState = yield select((state) => state.game);
      socket.emit("socketState", gameState);
    }
  });

  yield takeEvery(["DROP_DISC", "REQUEST_REMATCH"], function* (action) {
    const role = yield select((state) => state.game.role);
    if (role === "host") {
      const gameState = yield select((state) => state.game);
      socket.emit("socketState", gameState);
    } else {
      socket.emit("socketAction", action);
    }
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
                yield put(
                  actions.info({
                    message: "Opponent wants a rematch! 🆚",
                  })
                );
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

const NODE_ENV = process.env.NODE_ENV || "development";

const socketURL =
  NODE_ENV === "development"
    ? "http://localhost:9000"
    : "https://connect-four-backend.herokuapp.com";

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
