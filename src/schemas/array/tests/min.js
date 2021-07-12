import { filteredWithWhere } from '../utils';

export default () =>
  ({ value: v, where, inclusive }) =>
  (value, { resolve, is, createError }) => {
    const resolved = { value: resolve(v), where, inclusive };
    const matched = filteredWithWhere(value, where, { resolve, is });

    return (
      (inclusive
        ? matched.length >= resolved.value
        : matched.length > resolved.value) || createError({ resolved })
    );
  };
