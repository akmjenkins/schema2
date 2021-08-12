import { makeParams } from '../../utils';

export default ({ min, max, inclusive = true }) =>
  (value, { resolve, createError }) => {
    const resolved = {
      min: resolve(min),
      max: resolve(max),
      inclusive: resolve(inclusive),
    };

    const inc = value.length >= resolved.min && value.length <= resolved.max;
    const exc = value.length > resolved.min && value.length < resolved.max;

    return (
      (resolved.inclusive ? inc : exc) || createError(makeParams({ resolved }))
    );
  };
