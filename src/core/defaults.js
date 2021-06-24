export default ({ schemas = {}, path = [], ...rest } = {}) => ({
  multiple: false, // whether to stop after a single error at a given path
  abortEarly: true, // whether to stop after a single error anywhere in the schema
  sync: false, // whether validation will be synchronous (see assert)
  contextPrefix: '$', // how to reference context
  context: {}, // can be used in conditions/refs
  strict: false, // whether to run transforms
  coerce: false,
  assert: true, // whether to validate
  schemas,
  path,
  ...rest,
});
