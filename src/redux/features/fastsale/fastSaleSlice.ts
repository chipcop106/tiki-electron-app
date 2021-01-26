import { createSlice } from '@reduxjs/toolkit';

interface FastSaleState {}

const initialState: FastSaleState = {};

export const fastSaleSlice = createSlice({
  name: 'fastSaleSlice',
  initialState,
  reducers: {},
});

export const { actions } = fastSaleSlice;
