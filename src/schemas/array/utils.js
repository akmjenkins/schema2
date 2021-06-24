export const filteredWithWhere = (value, where, { resolve, is }) => {
  const resolvedWhere = where ? resolve(where) : where;
  return resolvedWhere ? value : value.filter((v) => is(resolvedWhere, v));
};
