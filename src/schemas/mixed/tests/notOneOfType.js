export default ({ schemas }) => (value, { is, resolve, createError }) => {
  const resolved = { schemas: schemas.map(resolve) };
  return (
    !resolved.schemas.some((s) => is(s, value)) ||
    createError({ params: { resolved } })
  );
};
