import { makeParams } from '../../utils';
export default ({ schema }) =>
  (value, { is, resolve, createError }) => {
    const resolved = { schema: resolve(schema) };
    return (
      Object.keys(value).every((v) => is(resolved.schema, v)) ||
      createError(makeParams({ resolved }))
    );
  };
