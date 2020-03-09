import React from 'react'
import { 
  useSelector
} from 'react-redux'
import gsap from "gsap"
import Transition from 'react-transition-group/Transition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { 
  ROW_COUNT, 
  COLUMN_COUNT,
  Player,
} from '../constants';
import * as selectors from '../selectors'
import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'

const discEnter = (columnIndex, rowIndex) => node => {
  gsap.fromTo(
    node,
    0.2 + 0.3 * (1 - (rowIndex / ROW_COUNT)),
    {attr: {cx: columnIndex, cy: ROW_COUNT,}},
    {attr: {cx: columnIndex, cy: rowIndex,}, ease: "bounce.out",},
  )
}

const discExit = (columnIndex) => node => {
  gsap.to(
    node,
    0.5,
    {delay: (columnIndex / COLUMN_COUNT) * 0.5, attr: {cy: `-=${ROW_COUNT}`,}, ease: "back.in(1.2)"},
  )
}

const Discs = () => {
  const columns = useSelector(selectors.columns)
  const a = 800
  const b = 400
  return (
    <g transform="translate(0.5, 0.5)">
      <defs>
        <linearGradient id={Player.One} gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={red[a]}/>
          <stop offset="100%" stopColor={red[b]}/>
        </linearGradient>
        <linearGradient id={Player.Two} gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={yellow[a]}/>
          <stop offset="100%" stopColor={yellow[b]}/>
        </linearGradient>
      </defs>
      <TransitionGroup component="g">
        {columns.map((column, columnIndex) => column.map((player, rowIndex) =>
          <Transition
            key={`${columnIndex} ${rowIndex}`}
            timeout={1000}
            onEnter={discEnter(columnIndex, rowIndex)}
            onExit={discExit(columnIndex)}
            >
            <circle cx={-1} cy={-1} r={0.5} fill={`url(#${player})`} />
          </Transition>
        ))}
      </TransitionGroup>
    </g>
  )
}

export default Discs