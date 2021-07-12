import { isValidDate, getTersity } from '../utils';

export default ({ parser }) =>
  ({ value: v, inclusive, tersity }) =>
  (value, { resolve, createError }) => {
    const params = { value: v, tersity, inclusive };
    const reference = parser(resolve(v));
    if (!isValidDate(reference))
      throw new Error(
        `Could not convert ${v} to a valid v for comparison purposes`,
      );

    const a = getTersity(value, tersity);
    const b = getTersity(reference, tersity);

    return inclusive ? a <= b : a < b || createError(params);
  };
