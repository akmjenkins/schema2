const TRUE = /^(true|1)$/i;
const FALSE = /^(false|0)$/i;

export default () => (value) => {
  if (TRUE.test(value)) return true;
  if (FALSE.test(value)) return false;
  return value;
};
