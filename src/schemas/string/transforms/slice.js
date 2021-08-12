export default ({ start = 0, end }) =>
  (value, { resolve }) =>
    value.slice(resolve(start), resolve(end));
