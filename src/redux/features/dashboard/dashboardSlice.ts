import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [],
  isLoadingData: false,
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
});

export const { actions } = dashboardSlice;

export default dashboardSlice.reducer;
