export default ({ value: v, inclusive }) =>
  (value, { createError, resolve }) => {
    const resolved = { value: resolve(v), inclusive };
    return (
      (inclusive
        ? value.length <= resolved.value
        : value.length < resolved.value) || createError({ resolved })
    );
  };
