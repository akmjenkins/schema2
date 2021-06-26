const objStringTag = {}.toString();

export default () => (value) => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value;

  // != null works for only null and undefined
  const strValue = value != null && value.toString ? value.toString() : value;

  if (strValue === objStringTag) return value;

  return strValue;
};
