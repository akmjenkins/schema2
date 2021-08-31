import { getTersity, isValidDate } from '../utils';
import { makeParams } from '../../utils';

const between =
  ({ min, max, inclusive = true, tersity }) =>
  (value, { resolve, createError, dateParser }) => {
    const resolved = {
      min: resolve(min),
      max: resolve(max),
      inclusive: resolve(inclusive),
      tersity: resolve(tersity),
    };
    const minP = dateParser(resolved.min);
    const maxP = dateParser(resolved.max);
    if (!isValidDate(minP))
      throw new Error(
        `Could not convert ${min} (resolved: ${resolved.min}) to a valid date for comparison purposes`,
      );

    if (!isValidDate(maxP)) {
      throw new Error(
        `Could not convert ${max} (resolved: ${resolved.max}) to a valid date for comparison purposes`,
      );
    }

    const minT = getTersity(minP, resolved.tersity);
    const maxT = getTersity(maxP, resolved.tersity);
    const valueT = getTersity(value, resolved.tersity);

    return (
      (resolved.inclusive
        ? valueT <= maxT && valueT >= minT
        : valueT < maxT && valueT > minT) ||
      createError(makeParams({ resolved }))
    );
  };

export default between;
