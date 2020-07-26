import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import SettingsIcon from "@material-ui/icons/Settings";
import { SnackbarProvider } from "notistack";
import React from "react";
import Confetti from "react-dom-confetti";
import { useDispatch, useSelector } from "react-redux";
import { show } from "redux-modal";
import { Player } from "../constants";
import * as selectors from "../selectors";
import Board from "./Board";
import GameButton from "./Button";
import Dialogs from "./Dialogs";
import Feedback from "./Feedback";
import Notifier from "./Notifier";

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    userSelect: "none",
    marginTop: theme.spacing(1),
    padding: 0,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const themeType = useSelector(selectors.theme);
  const isConfetti = useSelector(selectors.isConfetti);
  const isWin = useSelector(selectors.isWin);
  const winner = useSelector(selectors.winner);

  const theme = useTheme();
  // const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpenMenu = () => {
    dispatch(show("menu"));
  };

  const handleOpenSettings = () => {
    dispatch(show("settings"));
  };

  return (
    <ThemeProvider theme={themeType === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <SnackbarProvider
        disableWindowBlurListener
        preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        classes={{
          variantSuccess: classes.success,
          variantError: classes.error,
          variantWarning: classes.warning,
          variantInfo: classes.info,
        }}
        maxSnack={2}
      >
        <Container maxWidth="xs" className={classes.root}>
          <Dialogs />
          <Notifier />
          <Grid container justify="space-between">
            <Grid item>
              <IconButton onClick={handleOpenMenu}>
                <FiberNewIcon fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton onClick={handleOpenSettings}>
                <SettingsIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
          <Feedback />
          <Board />
          <GameButton />
          <div style={{ marginLeft: "50%" }}>
            <Confetti
              //https://daniel-lundin.github.io/react-dom-confetti/
              style={{
                width: "100%",
              }}
              active={isConfetti && isWin}
              config={{
                angle: 90,
                spread: 28,
                startVelocity: 45,
                elementCount: 50,
                dragFriction: 0.1,
                duration: 3000,
                stagger: 4,
                width: "10px",
                height: "10px",
                colors: [
                  winner === Player.One
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
                ],
              }}
            />
          </div>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
