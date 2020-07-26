import * as R from "ramda";
import { combineActions, handleActions } from "redux-actions";
import actions from "../actions";
import { COLUMN_COUNT, Player, PlayerType, ROW_COUNT } from "../constants";
import {
  currentPlayer,
  isOpponentOnline,
  isTurn,
  loser,
  oppositePlayer,
  winner,
} from "../selectors";

const {
  repeat,
  over,
  lensPath,
  append,
  mergeLeft,
  mergeRight,
  evolve,
  when,
  o,
  take,
  pipe,
  cond,
  equals,
  always,
  T,
  identity,
} = R;

const emptyColumns = repeat([], COLUMN_COUNT);

const initialState = {
  columns: emptyColumns,
  opponentType: PlayerType.MediumComputer,
  offlinePlayer: Player.One,
  /* Socket */
  role: "host",
  isSocketConnected: false,
  isWaitingForRematch: false,
  isOpponentWaitingForRematch: false,
  roomId: undefined,
  joinRoomError: undefined,
};

export const reducer = handleActions(
  {
    [actions.dropDisc]: (state, { payload: { playerType, columnIndex } }) =>
      when(
        isTurn(playerType),
        over(
          lensPath(["columns", columnIndex]),
          o(take(ROW_COUNT), append(currentPlayer(state)))
        )
      )(state),

    [actions.restartGame]: mergeLeft({
      columns: emptyColumns,
      offlinePlayer: Player.One,
    }),

    [actions.changeTeam]: evolve({ offlinePlayer: oppositePlayer }),

    [actions.changeOpponent]: (state, { payload: { playerType } }) =>
      mergeRight(state, {
        opponentType: playerType,
        columns: emptyColumns,
        offlinePlayer: Player.One,
      }),

    /* 
        Socket
    */

    [actions.requestRematch]: mergeLeft({ isWaitingForRematch: true }),

    [actions.rematch]: (state) =>
      pipe(
        mergeLeft({
          columns: emptyColumns,
          isWaitingForRematch: false,
          isOpponentWaitingForRematch: false,
        }),
        evolve({
          offlinePlayer: cond([
            [equals(winner(state)), always(Player.One)],
            [equals(loser(state)), always(Player.Two)],
            [T, identity],
          ]),
        })
      )(state),

    [actions.socketState]: (state, { payload: opponentState }) =>
      R.mergeRight(state, { columns: opponentState.columns }),

    [actions.socketAction]: (state, { payload: opponentAction }) =>
      handleActions(
        {
          [actions.dropDisc]: (state, { payload: { columnIndex } }) =>
            reducer(state, actions.dropDisc(PlayerType.Online, columnIndex)),

          [actions.requestRematch]: mergeLeft({
            isOpponentWaitingForRematch: true,
          }),
        },
        state
      )(state, opponentAction),

    [combineActions(actions.roomJoined, actions.joinedRoom)]: mergeLeft({
      columns: emptyColumns,
      opponentType: PlayerType.Online,
    }),

    [actions.roomJoined]: mergeLeft({
      roomId: undefined,
      offlinePlayer: Player.One,
    }),

    [actions.joinedRoom]: mergeLeft({
      offlinePlayer: Player.Two,
      role: "guest",
    }),

    [actions.disconnection]: pipe(
      when(
        isOpponentOnline,
        mergeLeft({ opponentType: PlayerType.Offline, columns: emptyColumns })
      ),
      mergeLeft({ isSocketConnected: false })
    ),

    [actions.roomEnded]: mergeLeft({
      opponentType: PlayerType.Offline,
      columns: emptyColumns,
    }),

    [combineActions(actions.startRoom, actions.joinRoom)]: when(
      isOpponentOnline,
      mergeLeft({ columns: emptyColumns, opponentType: PlayerType.Offline })
    ),

    [actions.connection]: mergeLeft({ isSocketConnected: true }),

    [actions.startedRoom]: (state, { payload: roomId }) =>
      mergeLeft({ roomId, role: "host" }, state),

    [actions.joinRoomError]: (state, { payload: error }) =>
      mergeLeft({ joinRoomError: error }, state),

    [combineActions(
      actions.roomEnded,
      actions.endedRoom,
      actions.disconnection
    )]: mergeLeft({
      isWaitingForRematch: false,
      roomId: undefined,
      joinRoomError: undefined,
    }),
  },
  initialState
);
