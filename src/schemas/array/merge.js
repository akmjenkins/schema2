export default (schemas) => {
  const inners = schemas.filter(({ inner }) => !!inner);
  // tuples can't be "merged" - the last one takes precedence
  if (inners.some(Array.isArray)) return inners.filter(Array.isArray).pop();
};
