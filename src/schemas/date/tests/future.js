const future =
  ({ now }) =>
  () =>
  (value) =>
    value > now();

export default future;
