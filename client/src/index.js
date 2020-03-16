import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import logger from 'redux-logger'
import registerServiceWorker from './registerServiceWorker'

import App from './components'
import reducer from './reducer'
import sagas from './sagas'

const sagaMiddleware = 
  createSagaMiddleware()
  
const store =
  createStore(reducer, applyMiddleware(logger, sagaMiddleware))

sagaMiddleware.run(sagas)

const Root = () =>
  <Provider store={store}>
    <App />
  </Provider>

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)

registerServiceWorker()