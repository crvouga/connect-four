import { useTheme } from "@material-ui/styles";
import gsap from "gsap";
import React from "react";
import { useSelector } from "react-redux";
import Transition from "react-transition-group/Transition";
import TransitionGroup from "react-transition-group/TransitionGroup";
import { COLUMN_COUNT, Player, ROW_COUNT } from "../constants";
import * as selectors from "../selectors";

const discEnter = (columnIndex, rowIndex) => (node) => {
  gsap.fromTo(
    node,
    0.2 + 0.3 * (1 - rowIndex / ROW_COUNT),
    { attr: { cx: columnIndex, cy: ROW_COUNT } },
    { attr: { cx: columnIndex, cy: rowIndex }, ease: "bounce.out" }
  );
};

const discExit = (columnIndex) => (node) => {
  gsap.to(node, 0.5, {
    delay: (columnIndex / COLUMN_COUNT) * 0.5,
    attr: { cy: `-=${ROW_COUNT}` },
    ease: "back.in(1.2)",
  });
};

const Discs = () => {
  const columns = useSelector(selectors.columns);
  const theme = useTheme();

  return (
    <>
      <defs>
        <radialGradient id={Player.One}>
          <stop offset="0%" stopColor={theme.palette.error.main} />
          <stop offset="100%" stopColor={theme.palette.error.dark} />
        </radialGradient>
        <radialGradient id={Player.Two}>
          <stop offset="50%" stopColor={theme.palette.warning.light} />
          <stop offset="100%" stopColor={theme.palette.warning.main} />
        </radialGradient>
      </defs>
      <TransitionGroup component="g" transform="translate(0.5, 0.5)">
        {columns.map((column, columnIndex) =>
          column.map((player, rowIndex) => (
            <Transition
              key={`${columnIndex} ${rowIndex}`}
              timeout={1000}
              onEnter={discEnter(columnIndex, rowIndex)}
              onExit={discExit(columnIndex)}
            >
              <circle
                cx={columnIndex}
                cy={rowIndex}
                r={0.5}
                fill={`url(#${player})`}
              />
            </Transition>
          ))
        )}
      </TransitionGroup>
    </>
  );
};

export default Discs;
