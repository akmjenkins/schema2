import { Date as SDate } from 'sugar-date';

export default () => (value) => {
  if (value instanceof Date) return value;
  const date = new SDate(value);
  return date.isValid() ? date.raw : null;
};
