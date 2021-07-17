import { filteredWithWhere } from '../utils';

export default () =>
  ({ value: v, where, inclusive }) =>
  (value, { resolve, is, createError }) => {
    const resolved = {
      value: resolve(v),
      where: resolve(where),
      inclusive: resolve(inclusive),
    };
    const matched = filteredWithWhere(value, resolved.where, { is });

    return (
      (resolved.inclusive
        ? matched.length <= resolved.value
        : matched.length < resolved.value) ||
      createError({ params: { resolved } })
    );
  };
