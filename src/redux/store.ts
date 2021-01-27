import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import createElectronStorage from 'redux-persist-electron-storage';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './features/rootReducer';
import rootSaga from './sagas/rootSaga';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: createElectronStorage(),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
    thunk: true,
  }),
  sagaMiddleware,
];

const store = configureStore({
  reducer: persistedReducer,
  middleware,
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export default store;
