import { makeParams } from '../../utils';
export default ({ value = true }) =>
  (v, { schema: { inner }, createError }) => {
    if (value) return true;
    const extraneous = Object.keys(v).filter((k) => !(k in inner));
    return extraneous.length === 0 || createError(makeParams({ extraneous }));
  };
