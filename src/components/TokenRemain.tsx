import React, { useEffect, useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import { useDispatch } from 'react-redux';
import { actions } from '../redux/features/account/accountSlice';

const TokenRemain = ({ time, id }) => {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const getTimeRemain = (date) => {
    return differenceInMinutes(date, new Date());
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const timer = getTimeRemain(time);
      setValue(timer);
      if (timer < 0) {
        clearInterval(interval);
        dispatch(actions.setExpiredToken(id));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return <strong>{value} phút</strong>;
};

export default TokenRemain;
