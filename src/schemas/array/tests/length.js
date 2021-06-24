import { filteredWithWhere } from '../utils';

export default () => ({ value: v, where }) => (
  value,
  { resolve, is, createError },
) => {
  const resolved = { value: resolve(v) };

  return (
    filteredWithWhere(value, where, { resolve, is }).length ===
      resolved.value || createError({ resolved })
  );
};
