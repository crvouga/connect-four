import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Slide from "@material-ui/core/Slide";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Zoom from "@material-ui/core/Zoom";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import ComputerIcon from "@material-ui/icons/Computer";
import GitHubIcon from "@material-ui/icons/GitHub";
import PersonIcon from "@material-ui/icons/Person";
import PublicIcon from "@material-ui/icons/Public";
import { drop, isNil, not, prop } from "ramda";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectModal, hide, show } from "redux-modal";
import actions from "../actions";
import { PlayerType } from "../constants";
import * as selectors from "../selectors";

const SlideRight = React.forwardRef((props, ref) => {
  return <Slide direction="right" ref={ref} {...props} />;
});

const SlideLeft = React.forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ZoomIn = React.forwardRef((props, ref) => {
  return <Zoom ref={ref} {...props} />;
});

const JoinRoomDialog = connectModal({ name: "joinRoom", destroyOnHide: false })(
  (props) => {
    const { show: isOpen, submit, cancel } = props;
    const dispatch = useDispatch();
    const [roomIdText, setRoomIdText] = useState("");
    const error = useSelector(selectors.joinRoomError);

    const maxLength = 3;
    useEffect(() => {
      if (roomIdText.length > maxLength) {
        setRoomIdText(drop(maxLength));
      }
      if (roomIdText.length < maxLength) {
        dispatch(actions.joinRoomError(undefined));
      }
      if (roomIdText.length === maxLength) {
        dispatch(submit(roomIdText));
      }
    }, [roomIdText, dispatch, submit]);

    const handleChange = ({ target: { value: roomIdText } }) => {
      setRoomIdText(roomIdText);
    };

    const onClose = () => {
      setRoomIdText("");
      dispatch(actions.joinRoomError(undefined));
      dispatch(cancel());
    };

    const handleJoin = () => {
      dispatch(submit(roomIdText));
    };

    return (
      <Dialog open={isOpen} onClose={onClose} TransitionComponent={ZoomIn}>
        <DialogTitle>What game number?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus={true}
            type="tel"
            pattern="[0-9]*"
            inputMode="numeric"
            variant="outlined"
            color="primary"
            error={not(isNil(error))}
            helperText={prop("reason", error)}
            value={roomIdText}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleJoin}>
            Join
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

const StartRoomDialog = connectModal({
  name: "startRoom",
  destroyOnHide: false,
})((props) => {
  const { show: isOpen, cancel } = props;
  const roomId = useSelector(selectors.roomId);
  const dispatch = useDispatch();

  return (
    <Dialog
      open={isOpen}
      onClose={() => dispatch(cancel())}
      TransitionComponent={ZoomIn}
    >
      <DialogTitle>
        Game number is{" "}
        <Box display="inline" fontWeight="bold" color="primary">
          {roomId}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container justify="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
        <DialogContentText>Waiting for opponent to join...</DialogContentText>
      </DialogContent>
    </Dialog>
  );
});

const LeaveRoomDialog = connectModal({
  name: "leaveRoom",
  destroyOnHide: false,
})((props) => {
  const { show: isOpen, interceptedAction } = props;
  const dispatch = useDispatch();
  const handleLeave = () => {
    dispatch(actions.leaveRoom());
    dispatch(hide("leaveRoom"));
    dispatch(interceptedAction);
  };
  const onClose = () => {
    dispatch(hide("leaveRoom"));
  };
  return (
    <Dialog open={isOpen} onClose={onClose} TransitionComponent={ZoomIn}>
      <DialogTitle>Are you sure you want to leave game?</DialogTitle>
      <DialogContent></DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleLeave}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
});

const SettingsDialog = connectModal({ name: "settings", destroyOnHide: false })(
  (props) => {
    const { show: isOpen } = props;
    const theme = useSelector(selectors.theme);
    const isConfetti = useSelector(selectors.isConfetti);

    const dispatch = useDispatch();

    const onClose = () => {
      dispatch(hide("settings"));
    };

    const toggleTheme = () => {
      dispatch(actions.toggleTheme());
    };

    const toggleConfetti = () => {
      dispatch(actions.toggleConfetti());
    };

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        direction="right"
        TransitionComponent={SlideLeft}
      >
        <List>
          <ListSubheader>
            <ListItemText primary="Settings" />
          </ListSubheader>

          <ListItem button onClick={toggleConfetti}>
            <ListItemIcon>
              <Switch checked={isConfetti} />
            </ListItemIcon>
            <ListItemText
              primary="Toggle Confetti"
              secondary={isConfetti ? "Confetti On" : "Confetti Off"}
            />
          </ListItem>

          <ListItem button onClick={toggleTheme}>
            <ListItemIcon>
              {theme === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
            </ListItemIcon>
            <ListItemText
              primary="Toggle Theme"
              secondary={theme === "light" ? "Light Theme" : "Dark Theme"}
            />
          </ListItem>

          <Divider />

          <Link
            href="https://github.com/crvouga/connect-four"
            underline="none"
            color="inherit"
          >
            <ListItem button>
              <ListItemIcon>
                <GitHubIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="Github Repository" />
            </ListItem>
          </Link>
        </List>
      </Dialog>
    );
  }
);

const MenuDialog = connectModal({ name: "menu", destroyOnHide: false })(
  (props) => {
    const { show: isOpen } = props;
    const isOpponentOnline = useSelector(selectors.isOpponentOnline);
    const isSocketNotConnected = useSelector(selectors.isSocketNotConnected);
    const dispatch = useDispatch();
    const onClose = () => {
      dispatch(hide("menu"));
    };
    const guardedDispatch = (action) => {
      onClose();
      if (isOpponentOnline) {
        dispatch(show("leaveRoom", { interceptedAction: action }));
      } else {
        dispatch(action);
      }
    };

    const handleChangeOpponent = (playerType) => () => {
      guardedDispatch(actions.changeOpponent(playerType));
    };

    const handleStartRoom = () => {
      guardedDispatch(actions.startRoom());
    };

    const handelJoinRoom = () => {
      guardedDispatch(actions.joinRoom());
    };

    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        direction="right"
        TransitionComponent={SlideRight}
      >
        <List>
          <ListSubheader>
            <ListItemText primary="New Game" />
          </ListSubheader>

          <Divider />

          <ListSubheader>
            <ListItemText primary="Play against a friend" />
          </ListSubheader>

          <ListItem
            button
            disabled={isSocketNotConnected}
            onClick={handleStartRoom}
          >
            <ListItemIcon>
              <PublicIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Start Game" />
          </ListItem>

          <ListItem
            button
            disabled={isSocketNotConnected}
            onClick={handelJoinRoom}
          >
            <ListItemIcon>
              <PublicIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Join Game" />
          </ListItem>

          <ListItem button onClick={handleChangeOpponent(PlayerType.Offline)}>
            <ListItemIcon>
              <PersonIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Offline" />
          </ListItem>

          <ListSubheader>
            <ListItemText primary="Play against a computer" />
          </ListSubheader>

          <ListItem
            button
            onClick={handleChangeOpponent(PlayerType.EasyComputer)}
          >
            <ListItemIcon>
              <ComputerIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Easy" />
          </ListItem>

          <ListItem
            button
            onClick={handleChangeOpponent(PlayerType.MediumComputer)}
          >
            <ListItemIcon>
              <ComputerIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Medium" />
          </ListItem>

          <ListItem
            button
            onClick={handleChangeOpponent(PlayerType.HardComputer)}
          >
            <ListItemIcon>
              <ComputerIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Hard" />
          </ListItem>
        </List>
      </Dialog>
    );
  }
);

const Dialogs = () => (
  <React.Fragment>
    <SettingsDialog />
    <MenuDialog />
    <JoinRoomDialog />
    <StartRoomDialog />
    <LeaveRoomDialog />
  </React.Fragment>
);

export default Dialogs;
