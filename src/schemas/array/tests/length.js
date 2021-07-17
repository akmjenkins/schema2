import { filteredWithWhere } from '../utils';

export default () =>
  ({ value: v, where }) =>
  (value, { resolve, is, createError }) => {
    const resolved = { value: resolve(v), where: resolve(where) };

    return (
      filteredWithWhere(value, resolved.where, { is }).length ===
        resolved.value || createError({ params: { resolved } })
    );
  };
