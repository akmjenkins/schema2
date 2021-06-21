export default (num, error) => (v, _, passError) =>
  v % num === 0 || passError(error);
