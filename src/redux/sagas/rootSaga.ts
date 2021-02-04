import { all, fork, take } from 'redux-saga/effects';
import dashboardSaga from './dashboardSaga';
import accountSaga, { deleteCartWatcher } from './accountSaga';

export default function* rootSaga() {
  yield all([
    ...dashboardSaga.map((watcher) => fork(watcher)),
    ...accountSaga.map((watcher) => fork(watcher)),
  ]);
}
