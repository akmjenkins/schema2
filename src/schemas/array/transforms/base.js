export default () => (val) => {
  if (typeof val === 'string')
    try {
      val = JSON.parse(val);
    } catch (err) {
      // skip
    }

  if (Array.isArray(val)) return val;
  throw new Error(
    `The value '${val}' could not be cast to a value that satisfies the array schema`,
  );
};
