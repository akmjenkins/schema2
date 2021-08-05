import { filteredWithWhere } from '../utils';

export default () =>
  ({ values, where, path }) =>
  (value, { resolve, is, createError }) => {
    const { resolved, subject } = filteredWithWhere(
      { values, where, path },
      { is, resolve },
      value,
    );

    return subject.length === value.length || createError({ resolved });
  };
