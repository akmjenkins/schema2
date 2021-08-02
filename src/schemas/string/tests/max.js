import { makeParams } from '../../utils';
export default ({ value: v, inclusive = true }) =>
  (value, { createError, resolve }) => {
    const resolved = { value: resolve(v), inclusive: resolve(inclusive) };
    return (
      (inclusive
        ? value.length <= resolved.value
        : value.length < resolved.value) ||
      createError(makeParams({ resolved }))
    );
  };
