import { makeParams } from '../../utils';
export default ({ fields }) =>
  (value, { resolve, createError }) => {
    const resolved = { fields: resolve(fields) };
    return (
      resolved.fields.every((f) => value[f] !== undefined) ||
      createError(makeParams({ resolved }))
    );
  };
