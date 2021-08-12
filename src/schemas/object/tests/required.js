import { makeParams } from '../../utils';
export default ({ keys }) =>
  (value, { resolve, createError }) => {
    const resolved = { keys: resolve(keys) };
    const missing = resolved.keys.filter((f) => value[f] === undefined);
    return (
      missing.length === 0 || createError(makeParams({ resolved, missing }))
    );
  };
