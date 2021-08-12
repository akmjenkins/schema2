export default (schemas) => schemas.filter(({ inner }) => !!inner).pop();
