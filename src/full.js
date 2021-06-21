import { tests as allTests, transforms as allTransforms } from './common';
import defaultMessages from './messages';
import { array, boolean, mixed, number, object, string, date } from './schemas';
import defaults from './defaults';
import c from './cast';
import i from './is';
import v from './validate';

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
} = includeSchemas({ array, boolean, mixed, number, object, string, date });

const all = (opts) => {
  const { schemas, messages, transforms, tests, ...rest } = defaults(opts);
  return {
    ...rest,
    messages: defaultMessages(messages),
    schemas: {
      ...allSchemas,
      ...schemas,
    },
    transforms: {
      ...allTransforms,
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

export const cast = (schema, value, options) => c(schema, value, all(options));
export const is = (schema, value, options) => i(schema, value, all(options));
export const validate = (schema, value, options) =>
  v(schema, value, all(options));
