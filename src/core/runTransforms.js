import { createGetOperator } from '../utils';

export default (schema, value, options, resolve, schemas) => {
  const { is, cast } = options;
  const { type: schemaType, transforms } = schema;

  const transformOptions = {
    ...options,
    schema,
    resolve,
    is: (schema, value) =>
      is(schema, value, { ...options, assert: true, sync: true }),
    cast: (schema, value) => cast(schema, value, options),
  };

  const getOperator = createGetOperator(schemaType, 'transforms', schemas);

  return transforms.reduce(
    (acc, { type, ...args }) => getOperator(type)(args)(acc, transformOptions),
    value,
  );
};
