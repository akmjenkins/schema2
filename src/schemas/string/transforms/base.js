const objStringTag = {}.toString();

export default () => (value) => {
  if (
    typeof value === 'string' ||
    Array.isArray(value) ||
    // purposely using == null - works for null and undefined
    value == null
  )
    return value;

  // != null works for only null and undefined
  const strValue = value.toString ? value.toString() : value;
  return strValue === objStringTag ? value : strValue;
};
