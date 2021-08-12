const TRUE = /^(true|1)$/i;
const FALSE = /^(false|0)$/i;

export default () => (value) => {
  if (TRUE.test(value)) return true;
  if (FALSE.test(value)) return false;
  if (typeof value === 'boolean') return value;

  throw new TypeError(
    `'${value}' could not be converted to a value that satisfied the boolean schema`,
  );
};
