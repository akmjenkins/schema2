import { isValidDate } from '../utils';

const base =
  ({ parser }) =>
  () =>
  (value) => {
    if (value instanceof Date) return value;
    const date = parser(value);
    if (isValidDate(date)) return date;
    throw new Error(
      `The value '${value}' could not be cast to a value that satisfies the date schema`,
    );
  };

export default base;
