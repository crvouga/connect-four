import computerSaga from './computer'
import socketSaga from './socket'
import { fork } from 'redux-saga/effects'
export default function* () {
  yield fork(socketSaga)
  yield fork(computerSaga)
}