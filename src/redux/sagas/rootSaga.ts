import { all, fork } from 'redux-saga/effects';
import dashboardSaga from './dashboardSaga';
import accountSaga from './accountSaga';

export default function* rootSaga() {
  yield all([
    ...dashboardSaga.map((watcher) => fork(watcher)),
    ...accountSaga.map((watcher) => fork(watcher)),
  ]);
}
