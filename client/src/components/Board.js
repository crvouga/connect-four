import React from 'react'
import { 
  makeStyles
} from '@material-ui/core/styles';
import { 
  COLUMN_COUNT, 
  ROW_COUNT, 
} from "../constants";
import Discs from "./Discs"
import Columns from "./Columns"
import Consecutives from "./Consecutives"

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: theme.spacing(1),
  },
}))

const Board = () => {
  const classes = useStyles()
  return (
    <svg className={classes.root} viewBox={[0, 0, COLUMN_COUNT, ROW_COUNT]}>
      <g transform={`translate(0, ${ROW_COUNT}) scale(1,-1)`}>
        <Discs />
        <Columns />
        <Consecutives />
      </g>
    </svg>
  )
}

export default Board