import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'

import App from './components'
import reducer from './reducer'
import sagas from './sagas'

const sagaMiddleware = 
  createSagaMiddleware()
  
const store =
  createStore(reducer, undefined, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(sagas)

const Root = () =>
  <Provider store={store}>
    <App />
  </Provider>

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
