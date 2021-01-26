import React, { useEffect, useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../redux/features/account/accountSlice';
import { RootState } from '../redux/features/rootReducer';

const TokenRemain = ({ time, id }) => {
  const [value, setValue] = useState(0);
  const accountInfo = useSelector(
    (state: RootState) =>
      state.account &&
      state.account.accounts &&
      [...state.account.accounts].find((acc) => acc.id === id)
  );
  const dispatch = useDispatch();
  const getTimeRemain = (date) => {
    return differenceInMinutes(date, new Date());
  };
  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      const timer = getTimeRemain(accountInfo?.expires_at);
      setValue(timer);
      if (timer < 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (value < 0) {
      dispatch(
        actions.loginAccount({
          id,
          username: accountInfo?.username,
          password: accountInfo?.password,
        })
      );
    }
  }, [value]);

  return <strong>{value} phút</strong>;
};

export default TokenRemain;
