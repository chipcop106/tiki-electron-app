import { combineReducers } from 'redux';

import { dashboardSlice } from './dashboard/dashboardSlice';
import { accountSlice } from './account/accountSlice';

const rootReducer = combineReducers({
  dashboard: dashboardSlice.reducer,
  account: accountSlice.reducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
