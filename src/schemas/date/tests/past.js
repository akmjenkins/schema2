const past =
  ({ now }) =>
  () =>
  (value) =>
    value < now();

export default past;
