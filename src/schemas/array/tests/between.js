import { filteredWithWhere } from '../utils';
import { makeParams } from '../../utils';

export default ({ min, max, inclusive }) =>
  (value, { resolve, createError, is }) => {
    const resolved = {
      min: resolve(min),
      max: resolve(max),
      inclusive: resolve(inclusive),
    };

    const len = filteredWithWhere(value, resolved.where, { is }).length;

    return (
      (inclusive
        ? len <= resolved.max && len >= resolved.min
        : len < resolved.max && len > resolved.min) ||
      createError(makeParams({ resolved }))
    );
  };
