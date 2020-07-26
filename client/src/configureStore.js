import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducer";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export default () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: [sagaMiddleware],
  });
  const persistor = persistStore(store);

  sagaMiddleware.run(sagas);

  return { store, persistor };
};
