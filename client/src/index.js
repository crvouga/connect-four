import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./components";
import reducer from "./reducer";
import registerServiceWorker from "./registerServiceWorker";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(sagas);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById("root"));

// registerServiceWorker();
