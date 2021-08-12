import { makeParams } from '../../utils';
export default ({ schema }) =>
  (value, { is, resolve, createError }) => {
    const resolved = { schema: resolve(schema) };
    const failed = Object.keys(value).filter((v) => !is(resolved.schema, v));
    return failed.length === 0 || createError(makeParams({ resolved, failed }));
  };
