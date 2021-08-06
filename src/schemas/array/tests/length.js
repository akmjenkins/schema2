import { makeParams } from '../../utils';

export default ({ value: v }) =>
  (value, { resolve, createError }) => {
    const resolved = { value: resolve(v) };
    return (
      value.length === resolved.value || createError(makeParams({ resolved }))
    );
  };
