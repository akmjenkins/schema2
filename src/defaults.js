import { number, string, object, boolean, mixed, array } from './schemas';
import * as defaultTests from './tests';
import defaultMessages from './messages';

export default ({
  schemas = {},
  transforms = {},
  tests = {},
  messages,
  debug = console.warn,
  ...rest
} = {}) => ({
  multiple: false, // whether to stop after a single error at a given path
  abortEarly: true, // whether to stop after a single error anywhere in the tree
  sync: false, // whether validation will be synchronous (see assert)
  contextPrefix: '$', // how to reference context
  context: {}, // can be used in conditions/refs
  strict: false, // whether to run transforms
  assert: true, // whether to validate
  messages: defaultMessages(messages), // error messages map
  debug, // where to print debug messages - pass false for no output
  warn: (...args) => debug && debug(...args),
  schemas: {
    object: object.schema,
    number: number.schema,
    string: string.schema,
    array: array.schema,
    mixed: mixed.schema,
    boolean: boolean.schema,
    ...schemas,
  },
  transforms: {
    ...object.transforms,
    ...number.transforms,
    ...string.transforms,
    ...array.transforms,
    ...mixed.transforms,
    ...boolean.transforms,
    ...transforms,
  },
  tests: {
    ...defaultTests,
    ...object.tests,
    ...number.tests,
    ...string.tests,
    ...array.tests,
    ...mixed.tests,
    ...boolean.tests,
    ...tests,
  },
  path: [],
  ...rest,
});
