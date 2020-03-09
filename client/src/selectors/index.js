import { 
  createSelector 
} from 'reselect'
import {
  prop,
  propOr,
  path,
  not,
  compose,
  length,
  flatten,
  pipe,
  modulo,
  equals,
  ifElse,
  always,
  filter,
  lte,
  complement,
  isEmpty,
  or,
  includes,
  __,
  curry,
} from 'ramda'
import {  
  COLUMN_COUNT, 
  ROW_COUNT, 
  WIN_COUNT, 
  Player, 
  PlayerType 
} from '../constants';

export const notifications = 
  prop('notifications')

export const socket = 
  prop('socket')

export const modal = 
  prop('modal')

export const game = 
  prop('game')
  
export const columns = state =>
  propOr(path(['game', 'columns'], state), 'columns', state)

export const offlinePlayer = state =>
  propOr(path(['game', 'offlinePlayer'], state), 'offlinePlayer', state)

export const opponentType = state =>
  propOr(path(['game', 'opponentType'], state), 'opponentType', state)

export const isSocketConnected =
  path(['socket', 'isSocketConnected'])

export const isSocketNotConnected =
  createSelector(isSocketConnected, not)

export const roomId =
  path(['socket', 'roomId'])

export const joinRoomError =
  path(['socket', 'joinRoomError'])

export const isWaitingForRematch =
  path(['socket', 'isWaitingForRematch'])


export const consecutives = createSelector(
  columns,
  columns => {
    const consecutives = []
    const visited = new Set()
    for(let i = 0; i < columns.length; i++) {
      for(let j = 0; j < columns[i].length; j++) {
        for(const [di, dj] of [[1, 1], [1, -1], [1, 0], [0, 1]]) {
          if(visited.has(""+di+dj+i+j)) {
            continue
          }
          const consecutive = []
          let ii = i, jj = j
          while(columns[i][j] === (columns[ii]||[])[jj]) {
            visited.add(""+di+dj+ii+jj)
            consecutive.push([ii, jj])
            ii += di
            jj += dj
          }
          if(consecutive.length >= 2) {
            consecutives.push(consecutive)
          }
        }
      }
    }
    return consecutives
  }
)

export const countDisc = createSelector(
  columns, 
  compose(length, flatten)
)

const isEven = 
  pipe(modulo(__, 2), equals(0))

export const currentPlayer = createSelector(
  countDisc, 
  ifElse(isEven, always(Player.One), always(Player.Two))
)

export const winningConsecutives = createSelector(
  consecutives, 
  filter(compose(lte(WIN_COUNT), length))
)

const isNotEmpty = 
  complement(isEmpty)

export const isWin = createSelector(
  winningConsecutives, 
  isNotEmpty
)

export const isNotWin = createSelector(
  isWin, 
  not
)

export const isTie = createSelector(
  countDisc, 
  equals(COLUMN_COUNT * ROW_COUNT)
)

export const isGameStart = createSelector(
  countDisc, 
  equals(0)
)

export const isGameNotStart = createSelector(
  isGameStart, 
  not
)

export const isGameOver = createSelector(
  isWin, 
  isTie, 
  or
)

export const isGameNotOver = createSelector(
  isGameOver, 
  not
)

export const oppositePlayer =
  ifElse(equals(Player.One), always(Player.Two), always(Player.One))

export const winner = createSelector(
  isWin, 
  currentPlayer,
  (isWin, currentPlayer) =>
    isWin && oppositePlayer(currentPlayer)
)

export const isOpponentOffline = createSelector(
  opponentType, 
  equals(PlayerType.Offline)
)

export const isOpponentOnline = createSelector(
  opponentType, 
  equals(PlayerType.Online)
)

const computerPlayerTypes = [
  PlayerType.EasyComputer, 
  PlayerType.MediumComputer, 
  PlayerType.HardComputer,
]

const isComputerPlayerType =
  includes(__, computerPlayerTypes)

export const isOpponentComputer = createSelector(
  opponentType, 
  isComputerPlayerType
)

export const currentPlayerType = createSelector(
  currentPlayer,
  offlinePlayer,
  opponentType,
  (currentPlayer, offlinePlayer, opponentType) =>
    currentPlayer === offlinePlayer ? PlayerType.Offline : opponentType
)

export const isTurnOffline = createSelector(
  currentPlayerType,
  equals(PlayerType.Offline),
)

export const isTurnNotOffline = createSelector(
  isTurnOffline, 
  not
)

export const isTurnComputer = createSelector(
  currentPlayerType, 
  isComputerPlayerType,
)

export const isTurnOnline = createSelector(
  currentPlayerType, 
  equals(PlayerType.Online)
)

export const isTurn = curry((playerType, state) =>
  isGameNotOver(state) && currentPlayerType(state) === playerType)

export const isColumnFull = curry((columnIndex, state) =>
  length(prop(columnIndex, columns(state))) >= ROW_COUNT)

export const isColumnNotFull = complement(isColumnFull)