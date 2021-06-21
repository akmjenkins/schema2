export default (error) => (v, _, passError) =>
  Number.isInteger(v) || passError(error);
