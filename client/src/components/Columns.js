import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { times } from "ramda";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../actions";
import { COLUMN_COUNT, PlayerType, ROW_COUNT } from "../constants";
import * as selectors from "../selectors";

const useStyles = makeStyles((theme) => ({
  column: {
    cursor: ({ isGameOver, isColumnFull }) =>
      isGameOver ? "default" : isColumnFull ? "not-allowed" : "pointer",
  },
}));

const Column = (props) => {
  const { columnIndex } = props;
  const isGameOver = useSelector(selectors.isGameOver);
  const isColumnFull = useSelector(selectors.isColumnFull(columnIndex));
  const classes = useStyles({ isColumnFull, isGameOver });
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(actions.dropDisc(PlayerType.Offline, columnIndex));
  };

  return (
    <rect
      onClick={handleClick}
      x={columnIndex}
      y={0}
      width={1}
      height={ROW_COUNT}
      fill="transparent"
      className={classes.column}
    />
  );
};

const Columns = () => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <defs>
        <pattern
          id="cell-pattern"
          patternUnits="userSpaceOnUse"
          width="1"
          height="1"
        >
          <circle cx="0.5" cy="0.5" r="0.45" fill="black"></circle>
        </pattern>
        <mask id="hole-mask">
          <rect width="10" height="60" fill="white"></rect>
          <rect width="10" height="60" fill="url(#cell-pattern)"></rect>
        </mask>
        <linearGradient id="column" gradientTransform="rotate(90)">
          <stop offset="0%" stopColor={theme.palette.info.dark} />
          <stop offset="100%" stopColor={theme.palette.info.main} />
        </linearGradient>
      </defs>
      {times(
        (columnIndex) => (
          <Column key={columnIndex} columnIndex={columnIndex} />
        ),
        COLUMN_COUNT
      )}
      <rect
        x={0}
        y={0}
        pointerEvents="none"
        width={COLUMN_COUNT}
        height={ROW_COUNT}
        mask="url(#hole-mask)"
        fill="url(#column)"
      />
    </React.Fragment>
  );
};

export default Columns;
