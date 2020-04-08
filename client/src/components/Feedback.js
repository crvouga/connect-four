import React from "react";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import SvgIcon from "@material-ui/core/SvgIcon";
import ComputerIcon from "@material-ui/icons/Computer";
import PersonIcon from "@material-ui/icons/Person";
import PublicIcon from "@material-ui/icons/Public";
import LinearProgress from "@material-ui/core/LinearProgress";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import { makeStyles } from "@material-ui/styles";
import { Player } from "../constants";
import * as selectors from "../selectors";
import clsx from "clsx";

const DiscIcon = props => (
  <SvgIcon {...props}>
    <svg viewBox={[0, 0, 2, 2]}>
      <circle cx={1} cy={1} r={1} />
    </svg>
  </SvgIcon>
);

const useStyles = makeStyles(theme => ({
  [Player.One]: {
    color: theme.palette.error.main,
    fontSize: "inherit"
  },

  [Player.Two]: {
    color: theme.palette.warning.light,
    fontSize: "inherit"
  },

  feedback: {
    textAlign: "center",
    fontSize: "large",
    fontWeight: "bold",
    color: theme.palette.text.secondary
  },

  blinking: {
    animationName: "$blinker",
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite"
  },

  "@keyframes blinker": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.3 },
    "100%": { opacity: 1 }
  }
}));

const Feedback = () => {
  const currentPlayer = useSelector(selectors.currentPlayer);
  const isTie = useSelector(selectors.isTie);
  const isWin = useSelector(selectors.isWin);
  const isGameOver = useSelector(selectors.isGameOver);
  const isGameStart = useSelector(selectors.isGameStart);
  const isOpponentComputer = useSelector(selectors.isOpponentComputer);
  const isOpponentOnline = useSelector(selectors.isOpponentOnline);
  const isTurnOffline = useSelector(selectors.isTurnOffline);
  const winner = useSelector(selectors.winner);
  const loser = useSelector(selectors.loser);
  const classes = useStyles({
    player: currentPlayer
  });
  return (
    <Box
      className={clsx(classes.feedback, {
        [classes.blinking]: !isGameOver && isOpponentOnline && isTurnOffline
      })}
    >
      {isWin ? (
        <>
          <DiscIcon className={classes[winner]} />{" "}
          <SentimentVerySatisfiedIcon fontSize="inherit" /> Winner{" "}
          <DiscIcon className={classes[loser]} />{" "}
          <SentimentVeryDissatisfiedIcon fontSize="inherit" /> Loser
        </>
      ) : isTie ? (
        <>
          <DiscIcon className={classes[Player.One]} /> Tie{" "}
          <DiscIcon className={classes[Player.Two]} />{" "}
        </>
      ) : isGameStart && isOpponentComputer && isTurnOffline ? (
        <>Drop Disc or Change Team</>
      ) : isOpponentOnline ? (
        <>
          <DiscIcon className={classes[currentPlayer]} />{" "}
          {isTurnOffline ? (
            <>
              <PersonIcon fontSize="inherit" /> Your Turn
            </>
          ) : (
            <>
              <PublicIcon fontSize="inherit" /> Opponent's Turn
            </>
          )}
        </>
      ) : (
        <>
          <DiscIcon className={classes[currentPlayer]} />{" "}
          {isTurnOffline ? (
            <>
              <PersonIcon fontSize="inherit" /> Turn
            </>
          ) : (
            <>
              <ComputerIcon fontSize="inherit" /> Turn
            </>
          )}
        </>
      )}
      <LinearProgress
        color={isTurnOffline || isGameOver ? "" : "secondary"}
        variant={isTurnOffline || isGameOver ? "determinate" : "query"}
        value={100}
      />
    </Box>
  );
};

export default Feedback;
