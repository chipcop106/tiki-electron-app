import React, { useEffect, useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../redux/features/account/accountSlice';
import { RootState } from '../redux/features/rootReducer';
import { getTimeRemain } from '../utils';

const TokenRemain = ({ time, id }) => {
  const accountInfo = useSelector(
    (state: RootState) =>
      state.account &&
      state.account.accounts &&
      [...state.account.accounts].find((acc) => acc.id === id)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = getTimeRemain(time);
      if (minutes <= 1) {
        dispatch(
          actions.loginAccount({
            id,
            username: accountInfo?.username,
            password: accountInfo?.password,
          })
        );
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return <strong>{getTimeRemain(time)} phút</strong>;
};

export default TokenRemain;
