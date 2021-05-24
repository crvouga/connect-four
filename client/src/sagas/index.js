import computerSaga from "./computer";
import socketSaga from "./socket";
import {
  fork,
  takeEvery,
  put
} from "redux-saga/effects";
import actions from "../actions";
import {
  PlayerType
} from "../constants";
import {
  has,
  propOr,
  toLower
} from "ramda";

export default function* () {
  yield takeEvery("CHANGE_OPPONENT", function* (action) {
    const {
      payload: {
        playerType
      }
    } = action;

    const playerTypeEmoji = {
      [PlayerType.EasyComputer]: "📱",
      [PlayerType.MediumComputer]: "🖥️",
      [PlayerType.HardComputer]: "🤖",
      [PlayerType.Offline]: "🙋‍♂",
    };
    if (has(playerType, playerTypeEmoji)) {
      const emoji = propOr("", playerType, playerTypeEmoji);
      const message = `Opponent changed to ${playerType} ${emoji}`;
      yield put(actions.info({
        message
      }));
    }
  });

  yield fork(socketSaga);
  yield fork(computerSaga);
}