import { takeEvery, all, call, takeLatest, put } from 'redux-saga/effects';
import {
  actions as dashboardActions,
  actionsType,
} from '../features/dashboard/dashboardSlice';

export function* fetchUserInformation({ payload }) {
  try {
    console.log({ payload });
  } catch (error) {
    console.log({ error });
  }
}

export default [
  function* fetchUserInformationWatcher() {
    yield takeEvery(dashboardActions.increment.type, fetchUserInformation);
  },
];
