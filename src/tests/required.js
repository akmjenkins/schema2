export default (message) => (value, { schemaType }) => {
  switch (schemaType) {
    case 'array':
    case 'string':
      return !!(value && value.length > 0) || message;
    default:
      return (value !== null && value !== undefined) || message;
  }
};
