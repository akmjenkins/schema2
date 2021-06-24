import { isValidDate } from '../utils';

export default ({ parser }) => () => (value) => {
  if (value instanceof Date) return value;
  const date = parser(value);
  return isValidDate(date) ? date : null;
};
