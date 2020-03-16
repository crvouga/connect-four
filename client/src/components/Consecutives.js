import React from 'react'
import { 
  useSelector 
} from 'react-redux'
import Transition from 'react-transition-group/Transition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import gsap from "gsap"
import { 
  makeStyles, useTheme 
} from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import {
  juxt,
  sortBy,
  head,
  last,
} from 'ramda'
import { 
  ROW_COUNT, 
  COLUMN_COUNT 
} from '../constants';
import * as selectors from '../selectors';

const useStyles = makeStyles(theme => ({
  root: {
    stroke: theme.palette.text.secondary,
    strokeWidth: 150,
    fill: 'transparent',
    pointerEvents: 'none',
  },
}))

const draw = (node) => {
  const length = node.getTotalLength()
  gsap.fromTo(
    node,
    0.7,
    {strokeDasharray: length, strokeDashoffset: length},
    {strokeDashoffset: 0},
  )
}

const unDraw = (node) => {
  const length = node.getTotalLength()
  gsap.to(
    node,
    0.5,
    {strokeDasharray: length, strokeDashoffset: length},
  )
}

const distance = ([x1, y1], [x2, y2]) =>
  ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5

const angleBetween = ([x1, y1], [x2, y2]) =>
  Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI

const Consecutive = (props) => {
  const classes = useStyles()

  const { consecutive, in: isIn } = props
  
  const [westIndex, eastIndex] =
    juxt([head, last])(sortBy(head, consecutive))

  const [i, j] = westIndex

  /* Have to increase the viewBox so that the draw animation is smooth >:-{ */
  const n = 1000
  return (
    <Transition
      in={isIn}
      key={consecutive}
      timeout={1000}
      onEnter={(node) => draw(node.getElementsByTagName('rect')[0])}
      onExit={(node) => unDraw(node.getElementsByTagName('rect')[0])}
      unmountOnExit
      >
      <svg
        x={0}
        y={0}
        width={COLUMN_COUNT}
        height={ROW_COUNT}
        viewBox={`0 0 ${COLUMN_COUNT*n} ${ROW_COUNT*n}`}>
        <rect
          transform={`
            rotate(${angleBetween(westIndex, eastIndex)} ${[(i+0.5)*n, (j+0.5)*n]})
          `}
          x={i*n}
          y={j*n}
          width={(distance(westIndex, eastIndex)+1)*n}
          height={n}
          rx={n/2}
          className={classes.root}
          />
      </svg>
    </Transition>
  )
}

const Consecutives = () => {
  const consecutives = useSelector(selectors.winningConsecutives)
  return (
    <TransitionGroup component="g">
      {consecutives.map((consecutive) => (
        <Consecutive key={consecutive} consecutive={consecutive}/>
      ))}
    </TransitionGroup>
  )
}


export default Consecutives