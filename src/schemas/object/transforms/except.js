export default ({ keys, where }) => (value, { is }) =>
  (keys || Object.keys(value).filter((k) => is(where, k))).reduce(
    (acc, k) => (delete acc[k], acc),
    { ...value },
  );
