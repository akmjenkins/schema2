import { filteredWithWhere } from '../utils';

export default () =>
  ({ min, max, values, where, path, inclusive = true }) =>
  (value, { resolve, is, createError }) => {
    const { resolved, subject } = filteredWithWhere(
      { values, where, path },
      { is, resolve },
      value,
    );

    resolved.min = resolve(min);
    resolved.max = resolve(max);
    resolved.inclusive = resolve(inclusive);
    return resolved.inclusive
      ? subject.length >= min.value && subject.length <= max.value
      : (subject.length > min.value && subject.length < max.value) ||
          createError({ resolved });
  };
