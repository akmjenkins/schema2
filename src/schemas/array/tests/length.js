import { makeParams } from '../../utils';
import { filteredWithWhere } from '../utils';

export default ({ value: v, where, path }) =>
  (value, { resolve, is, createError }) => {
    const resolved = {
      value: resolve(v),
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

    return (
      l === resolved.value || createError(makeParams({ resolved, actual: l }))
    );
  };
