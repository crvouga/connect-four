
import AlphaBetaConstructor from 'alphabeta'
import { 
  takeLeading, 
  select, 
  call, 
  put, 
  delay 
} from "@redux-saga/core/effects";
import { 
  ROW_COUNT, 
  PlayerType,
  WIN_COUNT, 
} from "../constants";
import * as selectors from "../selectors";
import actions from "../actions";
import { 
  prop,
} from 'ramda'

const scoreFunction = (state, callback) => {
  let score = 0
  for(const consecutive of selectors.consecutives(state)) {
    const [i, j] = consecutive[0]
    const player = state.columns[i][j]
    if(player === state.current) {
      if(consecutive.length >= WIN_COUNT) {
        return callback(Infinity)
      }
      score += consecutive.length ** consecutive.length
    }
  }
  return callback(-score)
}


const columnIndexes = [3, 4, 2, 5, 1, 6, 0]

const generateMoves = (state) => {
  const successors = []
  const nextPlayer = selectors.oppositePlayer(state.currentPlayer)
  for(const columnIndex of columnIndexes) {
    if(selectors.isColumnNotFull(columnIndex, state)) {
      const successor = JSON.parse(JSON.stringify(state))
      successor.columns[columnIndex].push(state.currentPlayer)
      successor.currentPlayer = nextPlayer
      successor.columnIndex = columnIndex
      successors.push(successor)
    }
  }
  return successors
}

const checkWinConditions = selectors.isGameOver


const alphabeta = AlphaBetaConstructor({
  scoreFunction,
  generateMoves,
  checkWinConditions,
  uniqueKey: JSON.stringify,
})

function * computerSaga() {
  yield takeLeading('*', function* () {
    if(yield select(selectors.isTurnComputer)) {
      const columns = yield select(selectors.columns)
      const currentPlayer = yield select(selectors.currentPlayer)
      const opponentType = yield select(selectors.opponentType)
      const alphabetaConfig = {
        state: {
          columns,
          currentPlayer,
          columnIndex: undefined,
        },
        depth: prop(opponentType, {
          [PlayerType.EasyComputer]: 3,
          [PlayerType.MediumComputer]: 4,
          [PlayerType.HardComputer]: 5,
        }),
      }
      alphabeta.setup(alphabetaConfig)
      const bestState = yield call(() => new Promise((resolve) => alphabeta.allSteps(resolve)))
      yield delay(1000/4)
      yield put(actions.dropDisc(opponentType, bestState.columnIndex))
    }
  })
}

export default computerSaga
