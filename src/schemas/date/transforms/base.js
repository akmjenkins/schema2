import { isValidDate } from '../utils';

const base =
  () =>
  (value, { dateParser }) => {
    if (value instanceof Date) return value;
    const date = dateParser(value);
    if (isValidDate(date)) return date;
    throw new TypeError(
      `The value '${value}' could not be cast to a value that satisfies the date schema`,
    );
  };

export default base;
