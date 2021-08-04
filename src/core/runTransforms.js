import { createGetOperator } from '../utils';

export default (schema, value, options, resolve) => {
  const { schemas, is } = options;
  const { type: schemaType, transforms } = schema;

  const transformOptions = {
    resolve,
    is: (schema, value) => is(schema, value, { ...options, sync: true }),
  };

  const getOperator = createGetOperator(schemaType, 'transforms', schemas);

  return transforms.reduce(
    (acc, { type, ...args }) => getOperator(type)(args)(acc, transformOptions),
    value,
  );
};
