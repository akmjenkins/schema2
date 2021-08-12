import { createGetOperator } from '../utils';

export default (schema, value, options, resolve) => {
  const { schemas, is, cast } = options;
  const { type: schemaType, transforms } = schema;

  const transformOptions = {
    schema,
    resolve,
    is: (schema, value) => is(schema, value, { ...options, sync: true }),
    cast: (schema, value) => cast(schema, value, options),
  };

  const getOperator = createGetOperator(schemaType, 'transforms', schemas);

  return transforms.reduce(
    (acc, { type, ...args }) => getOperator(type)(args)(acc, transformOptions),
    value,
  );
};
