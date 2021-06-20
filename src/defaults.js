export default ({
  schemas = {},
  transforms = {},
  tests = {},
  messages = {},
  debug = console.warn,
  ...rest
} = {}) => ({
  multiple: false, // whether to stop after a single error at a given path
  abortEarly: true, // whether to stop after a single error anywhere in the schema
  sync: false, // whether validation will be synchronous (see assert)
  contextPrefix: '$', // how to reference context
  context: {}, // can be used in conditions/refs
  strict: false, // whether to run transforms
  coerce: false,
  assert: true, // whether to validate
  messages: {
    ...(rest.messages || {}),
    ...messages,
  },
  debug, // where to print debug messages - pass false for no output
  warn: (...args) => debug && debug(...args),
  schemas: {
    ...(rest.schemas || {}),
    ...schemas,
  },
  transforms: {
    ...(rest.transforms || {}),
    ...transforms,
  },
  tests: {
    ...(rest.tests || {}),
    ...tests,
  },
  path: [],
  ...rest,
});
