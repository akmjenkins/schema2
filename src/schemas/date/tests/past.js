const past =
  () =>
  (value, { now }) =>
    value < now();

export default past;
