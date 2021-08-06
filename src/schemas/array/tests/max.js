import { makeParams } from '../../utils';

export default ({ value: v, inclusive = true }) =>
  (value, { resolve, createError }) => {
    const resolved = { value: resolve(v), inclusive: resolve(inclusive) };
    return (
      (resolved.inclusive
        ? value.length <= resolved.value
        : value.length < resolved.value) ||
      createError(makeParams({ resolved }))
    );
  };
