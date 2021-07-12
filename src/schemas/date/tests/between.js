import { getTersity, isValidDate } from '../utils';

export default ({ parser }) =>
  ({ min, max, inclusive, tersity }) =>
  (value, { resolve, createError }) => {
    const resolved = {
      min: parser(resolve(min)),
      max: parser(resolve(max)),
      inclusive,
    };
    if (!isValidDate(resolved.min))
      throw new Error(
        `Could not convert ${min} to a valid date for comparison purposes`,
      );

    if (!isValidDate(resolved.high)) {
      throw new Error(
        `Could not convert ${max} to a valid date for comparison purposes`,
      );
    }

    const lowT = getTersity(resolved.low, tersity);
    const highT = getTersity(resolved.high, tersity);
    const valueT = getTersity(value, tersity);

    return (
      (inclusive
        ? valueT <= highT && valueT >= lowT
        : valueT < highT && valueT > lowT) || createError({ resolved })
    );
  };
