import { getTersity, isValidDate } from '../utils';
import { makeParams } from '../../utils';

const between =
  ({ parser }) =>
  ({ min, max, inclusive = true, tersity }) =>
  (value, { resolve, createError }) => {
    const resolved = {
      min: parser(resolve(min)),
      max: parser(resolve(max)),
      inclusive: resolve(inclusive),
      tersity: resolve(tersity),
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

    const lowT = getTersity(resolved.low, resolved.tersity);
    const highT = getTersity(resolved.high, resolved.tersity);
    const valueT = getTersity(value, resolved.tersity);

    return (
      (resolved.inclusive
        ? valueT <= highT && valueT >= lowT
        : valueT < highT && valueT > lowT) ||
      createError(makeParams({ resolved }))
    );
  };

export default between;
