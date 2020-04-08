import { createActions } from "redux-actions";

export const ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR";
export const CLOSE_SNACKBAR = "CLOSE_SNACKBAR";
export const REMOVE_SNACKBAR = "REMOVE_SNACKBAR";

export const enqueueSnackbar = notification => {
  const key = notification.options && notification.options.key;
  return {
    ...notification,
    key: key || new Date().getTime() + Math.random()
  };
};

export const closeSnackbar = key => ({
  type: CLOSE_SNACKBAR,
  dismissAll: !key, // dismiss all if no key has been defined
  key
});

export const removeSnackbar = key => ({
  type: REMOVE_SNACKBAR,
  key
});

export default createActions({
  /* Game */
  DROP_DISC: (playerType, columnIndex) => ({ playerType, columnIndex }),
  RESTART_GAME: undefined,
  CHANGE_TEAM: undefined,
  CHANGE_OPPONENT: playerType => ({ playerType }),

  /* Socket */
  REMATCH: undefined,
  START_ROOM: undefined,
  JOIN_ROOM: undefined,
  LEAVE_ROOM: undefined,
  REQUEST_REMATCH: undefined,
  CONNECTION: undefined,
  DISCONNECTION: undefined,
  STARTED_ROOM: undefined,
  JOIN_ROOM_ERROR: undefined,
  JOINED_ROOM: undefined,
  ROOM_JOINED: undefined,
  ENDED_ROOM: undefined,
  ROOM_ENDED: undefined,
  SOCKET_ACTION: undefined,

  /* settings */
  TOGGLE_THEME: undefined,
  TOGGLE_CONFETTI: undefined,
  /* notifications */
  SUCCESS: payload =>
    enqueueSnackbar({
      ...payload,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "success"
      }
    }),
  INFO: payload =>
    enqueueSnackbar({
      ...payload,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "info"
      }
    }),
  WARNING: payload =>
    enqueueSnackbar({
      ...payload,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "warning"
      }
    }),
  ERROR: payload =>
    enqueueSnackbar({
      ...payload,
      options: {
        key: new Date().getTime() + Math.random(),
        variant: "error"
      }
    })
});
