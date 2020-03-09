import React from 'react'
import { 
  useSelector 
} from 'react-redux'
import Box from '@material-ui/core/Box';
import SvgIcon from '@material-ui/core/SvgIcon';
import CircularProgress from '@material-ui/core/CircularProgress';
import ComputerIcon from '@material-ui/icons/Computer'
import PersonIcon from '@material-ui/icons/Person'
import { 
  makeStyles 
} from '@material-ui/styles';
import { 
  Player 
} from '../constants'
import * as selectors from '../selectors'

const DiscIcon = (props) =>
  <SvgIcon {...props}>
    <svg viewBox={[0, 0, 2, 2]}>
      <circle cx={1} cy={1} r={1}/>
    </svg>
  </SvgIcon>

const useStyles = makeStyles(theme => ({
  
  [Player.One]: {
    color: theme[Player.One],
    fontSize: 'inherit',
  },

  [Player.Two]: {
    color: theme[Player.Two],
    fontSize: 'inherit',
  },

  message: {
    textAlign: 'center',
    fontSize: 'small',
    color: theme.palette.text.secondary,
  },

}))

const Message = () => {
  const currentPlayer = useSelector(selectors.currentPlayer)
  const isTie = useSelector(selectors.isTie)
  const isWin = useSelector(selectors.isWin)
  const isGameStart = useSelector(selectors.isGameStart)
  const isOpponentComputer = useSelector(selectors.isOpponentComputer)
  const isOpponentOnline = useSelector(selectors.isOpponentOnline)
  const isTurnOffline = useSelector(selectors.isTurnOffline)
  const winner = useSelector(selectors.winner)
  const classes = useStyles({player: currentPlayer})

  return (
      <Box className={classes.message}>
        {
        isWin ?
          <React.Fragment>
            Game Over
            {' '}
            <DiscIcon className={classes[winner]} />
            {' '}
            Won
          </React.Fragment> :
         isTie ?
          <React.Fragment>
            Tie Game
            {' '}
            <DiscIcon className={classes[Player.One]} />
            {' '}
            <DiscIcon className={classes[Player.Two]} />
            {' '}
          </React.Fragment> :

        isOpponentOnline ? (
            <React.Fragment>
              <DiscIcon className={classes[currentPlayer]} />
              {' '}
              {isTurnOffline ?
                <React.Fragment>
                  Your Turn
                </React.Fragment> :
                <React.Fragment>
                  Opponent's Turn...
                  {' '}
                  <CircularProgress size={18} />
                </React.Fragment>}
            </React.Fragment>
          ) :
          
          (isGameStart && isOpponentComputer) ?
          <React.Fragment>
            Start Game or Change Team
          </React.Fragment> :

          <React.Fragment>
            <DiscIcon className={classes[currentPlayer]} />
            {' '} 
            {isTurnOffline ? <PersonIcon fontSize='inherit' /> : <ComputerIcon fontSize='inherit' />}
            {' '} 
            Turn
          </React.Fragment> 
      }
      </Box>
  )
}

export default Message