import React from 'react'
import { 
  COLUMN_COUNT, 
  ROW_COUNT, 
} from "../constants";
import Discs from "./Discs"
import Columns from "./Columns"
import Consecutives from "./Consecutives"

const Board = () => {
  return (
    <svg viewBox={[0, 0, COLUMN_COUNT, ROW_COUNT]}>
      <g transform={`translate(0, ${ROW_COUNT}) scale(1,-1)`}>
        <Discs />
        <Columns />
        <Consecutives />
      </g>
    </svg>
  )
}

export default Board