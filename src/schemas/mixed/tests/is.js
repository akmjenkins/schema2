import { makeParams } from '../../utils';
export default ({ value: v, schema }) =>
  (value, { resolve, is, createError }) => {
    const resolved = { value: resolve(v), schema: resolve(schema) };
    return (
      (v !== undefined
        ? value === resolved.value
        : is(resolved.schema, value)) || createError(makeParams({ resolved }))
    );
  };
