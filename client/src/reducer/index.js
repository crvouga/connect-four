import {reducer as game} from './game'
import {reducer as socket} from './socket'
import {reducer as modal} from 'redux-modal'
import {reducer as notifications} from 'react-notification-system-redux'
import { combineReducers } from 'redux';
export default combineReducers({
  game,
  socket,
  modal,
  notifications,
})