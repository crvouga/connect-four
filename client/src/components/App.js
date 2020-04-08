import React from "react";
import { useSelector, useDispatch } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ThemeProvider, useTheme } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import * as selectors from "../selectors";
import GameButton from "./Button";
import Feedback from "./Feedback";
import Board from "./Board";
import Dialogs from "./Dialogs";
import Notifier from "./Notifier";
import Confetti from "react-dom-confetti";
import { show } from "redux-modal";

import actions from "../actions";
import { Player } from "../constants";
import { red, yellow } from "@material-ui/core/colors";
import { useMediaQuery } from "@material-ui/core";

const lightTheme = createMuiTheme({
  palette: {
    type: "light"
  }
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    userSelect: "none",
    marginTop: theme.spacing(1),
    padding: 0
  },
  success: {
    backgroundColor: theme.palette.success.main
  },
  error: {
    backgroundColor: theme.palette.error.main
  },
  warning: {
    backgroundColor: theme.palette.warning.main
  },
  info: {
    backgroundColor: theme.palette.info.main
  }
}));

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const themeType = useSelector(selectors.theme);
  const isConfetti = useSelector(selectors.isConfetti);
  const isWin = useSelector(selectors.isWin);
  const winner = useSelector(selectors.winner);

  const theme = useTheme();
  const isSmallDevice = useMediaQuery(theme.breakpoints.down("sm"));

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
          variantInfo: classes.info
        }}
        maxSnack={2}
      >
        <Container maxWidth="xs" className={classes.root}>
          <Dialogs />
          <Notifier />
          <Grid container justify="space-between">
            <Grid item>
              <IconButton onClick={handleOpenMenu}>
                <MenuIcon fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton>
                <SettingsIcon fontSize="large" onClick={handleOpenSettings} />
              </IconButton>
            </Grid>
          </Grid>
          <Feedback />
          <Board />
          <GameButton />
          <div style={{ marginLeft: "50%" }}>
            <Confetti
              style={{
                width: "100%"
              }}
              active={isConfetti && isWin}
              config={{
                angle: 90,
                spread: isSmallDevice ? 24 : 36,
                startVelocity: 45,
                elementCount: 50,
                dragFriction: 0.1,
                duration: 3000,
                stagger: 4,
                width: "10px",
                height: "10px",
                colors: [winner === Player.One ? red[500] : yellow[500]]
              }}
            />
          </div>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
