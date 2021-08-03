import { makeParams } from '../../utils';
export default ({ schema, where }) =>
  (value, { is, resolve, createError }) => {
    const resolved = { schema: resolve(schema), where: resolve(where) };

    return (
      Object.entries(value)
        .filter(([key]) => !resolved.where || is(resolved.where, key))
        .every(([, v]) => is(resolved.schema, v)) ||
      createError(makeParams({ resolved }))
    );
  };
