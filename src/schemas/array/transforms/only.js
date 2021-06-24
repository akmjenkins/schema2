export default ({ values, where }) => (value, { is }) =>
  value.filter((v) => (where ? is(where, v) : values.includes(v)));
