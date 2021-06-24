import { createGetOperator } from '../utils';

export default (schema, value, options, resolve) => {
  const { is, schemas } = options;
  const { type: schemaType, transforms } = schema;

  const transformOptions = {
    original: value,
    resolve,
    // this "is" is sync - current use case is for filtering arrays
    is: (schema, value) => is(schema, value, { ...options, sync: true }),
  };

  const getOperator = createGetOperator(schemaType, 'transforms', schemas);

  return transforms.reduce(
    (acc, { type, ...args }) => getOperator(type)(args)(acc, transformOptions),
    value,
  );
};
