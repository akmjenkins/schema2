import { makeParams } from '../../utils';

export default ({ min, max, inclusive = true }) =>
  (value, { resolve, createError }) => {
    const resolved = {
      min: resolve(min),
      max: resolve(max),
      inclusive: resolve(inclusive),
    };
    const len = value.length;
    const { max: high, min: low } = resolved;

    return (
      (inclusive ? len <= high && len >= low : len < high && len > low) ||
      createError(makeParams({ resolved }))
    );
  };
