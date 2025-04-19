import * as R from "ramda";
import { createSelector } from "reselect";
import {
  COLUMN_COUNT,
  Player,
  PlayerType,
  ROW_COUNT,
  WIN_COUNT,
} from "../constants";
const pathOrTail = R.curry((keys, obj) =>
  R.isEmpty(keys)
    ? undefined
    : R.pathOr(pathOrTail(R.tail(keys), obj), keys, obj)
);

export const notifications = R.prop("notifications");

export const theme = pathOrTail(["settings", "theme"]);

export const isConfetti = pathOrTail(["settings", "isConfetti"]);

export const columns = pathOrTail(["game", "columns"]);

export const offlinePlayer = pathOrTail(["game", "offlinePlayer"]);

export const opponentType = pathOrTail(["game", "opponentType"]);

export const isSocketConnected = pathOrTail(["game", "isSocketConnected"]);

export const isSocketNotConnected = createSelector(isSocketConnected, R.not);

export const roomId = pathOrTail(["game", "roomId"]);

export const joinRoomError = pathOrTail(["game", "joinRoomError"]);

export const isWaitingForRematch = pathOrTail(["game", "isWaitingForRematch"]);

export const isOpponentWaitingForRematch = pathOrTail([
  "game",
  "isOpponentWaitingForRematch",
]);

export const consecutives = createSelector(columns, (columns) => {
  const consecutives = [];
  const visited = new Set();
  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns[i].length; j++) {
      for (const [di, dj] of [
        [1, 1],
        [1, -1],
        [1, 0],
        [0, 1],
      ]) {
        if (visited.has("" + di + dj + i + j)) {
          continue;
        }
        const consecutive = [];
        let ii = i,
          jj = j;
        while (columns[i][j] === (columns[ii] || [])[jj]) {
          visited.add("" + di + dj + ii + jj);
          consecutive.push([ii, jj]);
          ii += di;
          jj += dj;
        }
        if (consecutive.length >= 2) {
          consecutives.push(consecutive);
        }
      }
    }
  }
  return consecutives;
});

export const countDisc = createSelector(
  columns,
  R.compose(R.length, R.flatten)
);

const isEven = R.pipe(R.modulo(R.__, 2), R.equals(0));

export const currentPlayer = createSelector(
  countDisc,
  R.ifElse(isEven, R.always(Player.One), R.always(Player.Two))
);

export const winningConsecutives = createSelector(
  consecutives,
  R.filter(R.compose(R.lte(WIN_COUNT), R.length))
);

const isNotEmpty = R.complement(R.isEmpty);

export const isWin = createSelector(winningConsecutives, isNotEmpty);

export const isNotWin = createSelector(isWin, R.not);

export const isTie = createSelector(
  countDisc,
  R.equals(COLUMN_COUNT * ROW_COUNT)
);

export const isGameStart = createSelector(countDisc, R.equals(0));

export const isGameNotStart = createSelector(isGameStart, R.not);

export const isGameOver = createSelector(isWin, isTie, R.or);

export const isGameNotOver = createSelector(isGameOver, R.not);

export const oppositePlayer = R.ifElse(
  R.equals(Player.One),
  R.always(Player.Two),
  R.always(Player.One)
);

export const winner = createSelector(
  isWin,
  currentPlayer,
  (isWin, currentPlayer) => isWin && oppositePlayer(currentPlayer)
);

export const loser = createSelector(winner, oppositePlayer);

export const isOpponentOffline = createSelector(
  opponentType,
  R.equals(PlayerType.Offline)
);

export const isOpponentOnline = createSelector(
  opponentType,
  R.equals(PlayerType.Online)
);

const computerPlayerTypes = [
  PlayerType.EasyComputer,
  PlayerType.MediumComputer,
  PlayerType.HardComputer,
];

export const isComputerPlayerType = R.includes(R.__, computerPlayerTypes);

export const isOpponentComputer = createSelector(
  opponentType,
  isComputerPlayerType
);

export const currentPlayerType = createSelector(
  currentPlayer,
  offlinePlayer,
  opponentType,
  (currentPlayer, offlinePlayer, opponentType) =>
    currentPlayer === offlinePlayer ? PlayerType.Offline : opponentType
);

export const isTurnOffline = createSelector(
  currentPlayerType,
  R.equals(PlayerType.Offline)
);

export const isTurnNotOffline = createSelector(isTurnOffline, R.not);

export const isTurnComputer = createSelector(
  currentPlayerType,
  isComputerPlayerType
);

export const isTurnOnline = createSelector(
  currentPlayerType,
  R.equals(PlayerType.Online)
);

export const isTurn = R.curry(
  (playerType, state) =>
    isGameNotOver(state) && currentPlayerType(state) === playerType
);

export const isColumnFull = R.curry(
  (columnIndex, state) =>
    R.length(R.prop(columnIndex, columns(state))) >= ROW_COUNT
);

export const isColumnNotFull = R.complement(isColumnFull);
