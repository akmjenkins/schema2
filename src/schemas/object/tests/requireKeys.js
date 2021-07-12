export default ({ keys, error }) =>
  (value, { resolve }, passError) => {
    const missing = keys.map(resolve).filter((k) => k in value);
    return !missing.length || passError(error, { params: { missing } });
  };
