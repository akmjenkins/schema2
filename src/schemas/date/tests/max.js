import { isValidDate, getTersity } from '../utils';
import { makeParams } from '../../utils';

const max =
  ({ value: v, inclusive = true, tersity }) =>
  (value, { resolve, createError, dateParser }) => {
    const resolved = {
      value: resolve(v),
      tersity: resolve(tersity),
      inclusive: resolve(inclusive),
    };
    const reference = dateParser(resolved.value);
    if (!isValidDate(reference))
      throw new Error(
        `Could not convert ${v} (resolved: ${resolved.value}) to a valid date for comparison purposes`,
      );

    const a = getTersity(value, resolved.tersity);
    const b = getTersity(reference, resolved.tersity);

    return resolved.inclusive
      ? a <= b
      : a < b || createError(makeParams({ resolved }));
  };

export default max;
