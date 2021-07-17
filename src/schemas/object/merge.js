export default (schemas, schemaMerger) => {
  return schemas.reduce((acc, { inner = {} }) => {
    return Object.entries(inner).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: acc[k] ? schemaMerger(acc[k], v) : v }),
      acc,
    );
  }, {});
};
