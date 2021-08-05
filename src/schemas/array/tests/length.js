import { filteredWithWhere } from '../utils';

export default () =>
  ({ value: v, values, where, path }) =>
  (value, { resolve, is, createError }) => {
    const { resolved, subject } = filteredWithWhere(
      { values, where, path },
      { is, resolve },
      value,
      true,
    );

    resolved.value = resolve(v);
    return subject.length === resolved.value || createError({ resolved });
  };
