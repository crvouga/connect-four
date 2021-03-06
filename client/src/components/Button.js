import React from "react";
import { useDispatch, useSelector } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import * as selectors from "../selectors";
import actions from "../actions";
import { not } from "ramda";
import { Player } from "../constants";

const GameButton = () => {
  const isOpponentOnline = useSelector(selectors.isOpponentOnline);
  const isOpponentComputer = useSelector(selectors.isOpponentComputer);
  const isGameOver = useSelector(selectors.isGameOver);
  const isGameStart = useSelector(selectors.isGameStart);
  const isWaitingForRematch = useSelector(selectors.isWaitingForRematch);
  const isOpponentWaitingForRematch = useSelector(
    selectors.isOpponentWaitingForRematch
  );
  const offlinePlayer = useSelector(selectors.offlinePlayer);
  const dispatch = useDispatch();

  const handleRestartGame = () => {
    dispatch(actions.restartGame());
  };

  const handleRematch = () => {
    dispatch(actions.requestRematch());
  };

  const handleChangeTeam = () => {
    dispatch(actions.changeTeam());
  };

  return (
    <>
      {isGameStart && isOpponentComputer ? (
        <Button
          disabled={offlinePlayer === Player.Two}
          size="large"
          fullWidth
          color="secondary"
          onClick={handleChangeTeam}
        >
          <Box fontWeight="bold" fontSize="large">
            Change Team
          </Box>
        </Button>
      ) : not(isOpponentOnline) && not(isGameStart) ? (
        <Button
          size="large"
          fullWidth
          color={"secondary"}
          variant={isGameOver ? "contained" : "text"}
          onClick={handleRestartGame}
        >
          <Box fontWeight="bold" fontSize="large">
            {isGameOver ? "Play Again" : "Restart Game"}
          </Box>
        </Button>
      ) : isGameOver && isOpponentOnline ? (
        <>
          <Button
            size="large"
            disabled={isWaitingForRematch}
            fullWidth
            color="secondary"
            variant="contained"
            onClick={handleRematch}
          >
            <Box fontWeight="bold" fontSize="large">
              {isWaitingForRematch
                ? "Waiting for opponent..."
                : isOpponentWaitingForRematch
                ? "Rematch?"
                : "Play Again"}
            </Box>
          </Button>
          {isWaitingForRematch && (
            <LinearProgress color="secondary" variant="query" />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default GameButton;
