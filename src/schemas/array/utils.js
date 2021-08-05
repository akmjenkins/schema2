import { get } from '../../utils';

export const filteredWithWhere = (
  { values, where, path },
  { is, resolve },
  value,
  negate,
) => {
  const resolved = {
    path: resolve(path),
    vs: (resolve(values) || []).map(resolve),
    w: resolve(where),
  };

  const getter = (v) => (resolved.path ? get(v, resolved.path) : v);

  const checker = (v) => {
    const _v = getter(v);
    const ret = resolved.w ? is(resolved.w, _v) : resolved.vs.includes(_v);
    return negate ? !ret : ret;
  };

  return {
    subject: value.filter(checker),
    resolved,
  };
};
