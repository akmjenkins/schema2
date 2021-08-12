import { makeParams } from '../../utils';
export default ({ value: v }) =>
  (value, { createError, resolve }) => {
    const resolved = { value: resolve(v) };
    return (
      value.length === resolved.value || createError(makeParams({ resolved }))
    );
  };
