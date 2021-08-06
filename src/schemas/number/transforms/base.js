export default () => (value) => {
  if (typeof value === 'string') {
    value = value.replace(/\s/g, '');
    if (value) value = +value;
  }

  value = parseFloat(value);
  if (typeof value === 'number' && !isNaN(value)) return value;

  throw new Error(
    `The value '${value}' could not be cast to a value that satisfies the number schema`,
  );
};
