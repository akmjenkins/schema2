import * as allTests from './tests';
import defaultMessages from './messages';
import { array, boolean, mixed, number, object, string } from './schemas';
import defaults from './defaults';

const includeSchemas = (schemas) =>
  Object.entries(schemas).reduce(
    (acc, [name, { schema, tests, transforms }]) => ({
      ...acc,
      schemas: {
        ...acc.schemas,
        [name]: schema,
      },
      tests: {
        ...acc.tests,
        ...tests,
      },
      transforms: {
        ...acc.transforms,
        ...transforms,
      },
    }),
    { schemas: {}, tests: {}, transforms: {} },
  );

const {
  schemas: allSchemas,
  tests: schemaTests,
  transforms: schemaTransforms,
} = includeSchemas({ array, boolean, mixed, number, object, string });

export default (opts) => {
  const { schemas, messages, transforms, tests, ...rest } = defaults(opts);
  return {
    ...rest,
    messages: defaultMessages(messages),
    schemas: {
      ...allSchemas,
      ...schemas,
    },
    transforms: {
      ...schemaTransforms,
      ...transforms,
    },
    tests: {
      ...allTests,
      ...schemaTests,
      ...tests,
    },
  };
};
