const future =
  () =>
  (value, { now }) =>
    value > now();

export default future;
