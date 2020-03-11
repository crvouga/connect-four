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
})
