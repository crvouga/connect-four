import { handleActions, combineActions } from 'redux-actions'
import { mergeLeft } from 'ramda'
import actions from '../actions'

export const reducer = handleActions(
  {
    [actions.connection]:
      mergeLeft({isSocketConnected: true}),

    [actions.disconnection]:
      mergeLeft({isSocketConnected: false,}),

    [actions.startedRoom]: (state, {payload: roomId}) =>
      mergeLeft({roomId}, state),

    [actions.roomJoined]:
      mergeLeft({roomId: undefined}),

    [actions.joinRoomFailed]: (state, {payload: joinRoomError}) => 
      mergeLeft({joinRoomError}, state),

    [actions.requestRematch]: 
      mergeLeft({isWaitingForRematch: true}),
    
    [actions.rematch]:
      mergeLeft({isWaitingForRematch: false}),

    [combineActions(actions.roomEnded, actions.endedRoom, actions.disconnection)]: 
      mergeLeft({isWaitingForRematch: false, roomId: undefined, joinRoomError: undefined}),

  },
  {
    isSocketConnected: false,
    isWaitingForRematch: false,
    roomId: undefined,
    joinRoomError: undefined,
  },
)
