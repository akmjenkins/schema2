export const filteredWithWhere = (value, where, { is }) =>
  where ? value : value.filter((v) => is(where, v));
