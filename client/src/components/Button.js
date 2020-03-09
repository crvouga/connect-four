import React from 'react';
import { 
  useDispatch, 
  useSelector, 
} from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'
import Button from '@material-ui/core/Button'
import * as selectors from '../selectors'
import actions from '../actions'
import {
  not
} from 'ramda'
const GameButton = () => {
  const isOpponentOnline = useSelector(selectors.isOpponentOnline)
  const isOpponentComputer = useSelector(selectors.isOpponentComputer)
  const isGameOver = useSelector(selectors.isGameOver)
  const isGameStart = useSelector(selectors.isGameStart)
  const isWaitingForRematch = useSelector(selectors.isWaitingForRematch)
  const dispatch = useDispatch()

  const handleRestartGame = () => {
    dispatch(actions.restartGame())
  }
  
  const handleRematch = () => {
    dispatch(actions.requestRematch())
  }
  
  const handleChangeTeam = () => {
    dispatch(actions.changeTeam())
  }

  return (
    <React.Fragment>
      {isGameStart && isOpponentComputer ?
        <Button fullWidth color='primary' onClick={handleChangeTeam}>
          Change Team
        </Button> :
      isGameOver && isOpponentOnline ?
        <React.Fragment>
          <Button disabled={isWaitingForRematch} fullWidth color='primary' variant='outlined' onClick={handleRematch}>
            {isWaitingForRematch ? 'Waiting for opponent...' : 'Rematch?'}
          </Button>
          {isWaitingForRematch && <LinearProgress />}
        </React.Fragment> :
      not(isOpponentOnline) ?
        <Button fullWidth color='primary' variant= {isGameOver ? 'outlined' : 'text'} onClick={handleRestartGame}>
          {isGameOver ? 'Play Again?' : 'Restart Game'}
        </Button>:
      <React.Fragment/>}
    </React.Fragment>
  )
}

export default GameButton
