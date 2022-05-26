import { put, takeEvery } from "@redux-saga/core/effects";
import { keys, prop } from "ramda";
import actions from "../actions";

const { success, info, error } = actions;

const notifications = {
  CONNECTION: info({
    message: "Multiplayer server connected",
  }),
  // DISCONNECTION: error({
  //   message: "Server disconnected 😑",
  // }),
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
};

export default function* () {
  yield takeEvery(keys(notifications), function* (action) {
    yield put(prop(action.type, notifications));
  });
}
