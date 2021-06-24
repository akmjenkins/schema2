export default ({ value: v }) => (value, { resolve }) =>
  value === undefined ? resolve(v) : value;
