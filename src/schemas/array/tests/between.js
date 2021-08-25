import { makeParams } from '../../utils';
import { filteredWithWhere } from '../utils';

export default ({ min, max, where, path, inclusive = true }) =>
  (value, { resolve, is, createError }) => {
    const resolved = {
      min: resolve(min),
      max: resolve(max),
      inclusive: resolve(inclusive),
      path: resolve(path),
      where: resolve(where),
    };

    let subject;
    if (resolved.where) {
      subject = filteredWithWhere(
        { where: resolved.where, path: resolved.path },
        { is, resolve },
        value,
      ).subject;
    } else {
      subject = value;
    }

    const l = subject.length;
    const inc = l >= resolved.min && l <= resolved.max;
    const exc = l > resolved.min && l < resolved.max;

    return (
      (resolved.inclusive ? inc : exc) ||
      createError(makeParams({ resolved, actual: l }))
    );
  };
