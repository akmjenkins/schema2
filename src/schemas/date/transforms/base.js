import { isValidDate } from '../utils';

const INVALID_DATE = new Date('');

const base =
  ({ parser }) =>
  () =>
  (value) => {
    if (value instanceof Date) return value;
    const date = parser(value);
    return isValidDate(date) ? date : INVALID_DATE;
  };

export default base;
