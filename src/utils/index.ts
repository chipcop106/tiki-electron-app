import { differenceInMinutes } from 'date-fns';

export const getTimeRemain = (date) => {
  return differenceInMinutes(date, new Date());
};
