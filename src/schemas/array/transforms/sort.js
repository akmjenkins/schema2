import { get } from '../../../utils';

const MULTIPLIERS = {
  asc: 1,
  desc: -1,
};

const NUMERIC = 'numeric';
const ALPHA = 'alpha';

const METHODS = {
  [ALPHA]: (a, b) => a.localeCompare(b),
  [NUMERIC]: (a, b) => a - b,
};

export default ({ path, dir = 'asc', method }) =>
  (value, { resolve }) => {
    const resolved = {
      path: resolve(path),
      dir: resolve(dir),
      method: resolve(method),
    };
    const getter = (from) => (resolved.path ? get(from, resolved.path) : from);
    if (!resolved.method)
      resolved.method =
        typeof (getter(value[0]) ?? 1) === 'number' ? NUMERIC : ALPHA;

    const multiplier = MULTIPLIERS[resolved.dir];
    if (!multiplier)
      throw new Error(
        `dir must be one of asc or desc, received ${dir} (resolved: ${resolved.dir})`,
      );

    const fn = METHODS[resolved.method];
    if (!fn) throw new Error(`method must be one of ${ALPHA} or ${NUMERIC}`);

    return [...value].sort((a, b) => fn(getter(a), getter(b)) * multiplier);
  };
