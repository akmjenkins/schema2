import { filteredWithWhere } from '../utils';

export default () =>
  ({ value: v, values, where, path, inclusive = true }) =>
  (value, { resolve, is, createError }) => {
    const { resolved, subject } = filteredWithWhere(
      { values, where, path },
      { is, resolve },
      value,
    );

    resolved.value = resolve(v);
    resolved.inclusive = resolve(inclusive);
    return (
      (resolved.inclusive
        ? subject.length >= resolved.value
        : subject.length > resolved.value) || createError({ resolved })
    );
  };
