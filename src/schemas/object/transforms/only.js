export default ({ keys, values, where }) =>
  (value, { is }) =>
    (keys || Object.keys(value).filter((k) => is(where, k))).reduce(
      (acc, k) => ((acc[k] = value[k]), acc),
      {},
    );
