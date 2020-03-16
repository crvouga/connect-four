import { createActions } from 'redux-actions'

export default createActions({
  DROP_DISC: (playerType, columnIndex) => ({ playerType, columnIndex,}),
  RESTART_GAME: undefined,
  CHANGE_TEAM: undefined,
  CHANGE_OPPONENT: playerType => ({ playerType }),
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
  TOGGLE_THEME: undefined,
})


export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export const enqueueSnackbar = (notification) => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

export const closeSnackbar = key => ({
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
});

export const removeSnackbar = key => ({
    type: REMOVE_SNACKBAR,
    key,
});
