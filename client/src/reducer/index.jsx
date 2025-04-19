import {reducer as game} from './game'
import {reducer as settings} from './settings'
import {reducer as modal} from 'redux-modal'
import {reducer as notifications} from './notifications'
import { combineReducers } from 'redux';
export default combineReducers({
  game,
  modal,
  notifications,
  settings,
})