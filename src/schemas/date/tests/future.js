export default () =>
  (value, { now }) =>
    value > now();
