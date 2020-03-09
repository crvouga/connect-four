import React from 'react'
import  { 
  useDispatch, 
  useSelector,
} from 'react-redux'
import {
  times,
} from 'ramda'
import { 
  makeStyles 
} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { 
  ROW_COUNT, 
  COLUMN_COUNT, 
  PlayerType, 
} from '../constants'
import actions from '../actions'
import * as selectors from '../selectors'

const useStyles = makeStyles(theme => ({
  column: { 
    cursor: ({ isGameOver, isColumnFull, isTurnNotOffline }) => 
      isGameOver ? 'default' :
      isTurnNotOffline ? 'wait' :
      isColumnFull ? 'not-allowed' : 
      'pointer'
  },
}))

const Column = (props) => {
  const { columnIndex } = props
  const isGameOver = useSelector(selectors.isGameOver)
  const isColumnFull = useSelector(selectors.isColumnFull(columnIndex))
  const isTurnNotOffline = useSelector(selectors.isTurnNotOffline)
  const classes = useStyles({isColumnFull, isTurnNotOffline, isGameOver})
  const dispatch = useDispatch()

  const handleClick = () => {
    dispatch(actions.dropDisc(PlayerType.Offline, columnIndex))
  }

  return (
    <rect 
      onClick={handleClick}
      x={columnIndex}
      y={0}
      width={1}
      height={ROW_COUNT}
      mask="url(#hole-mask)"
      fill="url(#column)"
      className={classes.column}
      />
  )
}

const Columns = () => {
  return (
    <React.Fragment>
      <defs>
        <pattern id="cell-pattern" patternUnits="userSpaceOnUse" width="1" height="1">
          <circle  cx="0.5" cy="0.5" r="0.45" fill="black"></circle>
        </pattern>
        <mask id="hole-mask">
          <rect width="10" height="60" fill="white"></rect>
          <rect width="10" height="60" fill="url(#cell-pattern)"></rect>
        </mask>
        <linearGradient id='column' gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={blue[700]}/>
          <stop offset="100%" stopColor={blue[500]}/>
        </linearGradient>
      </defs>
      {times((columnIndex) => 
        <Column  key={columnIndex} columnIndex={columnIndex} />, 
        COLUMN_COUNT
      )}
    </React.Fragment>
  )
}

export default Columns