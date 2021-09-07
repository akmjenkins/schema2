const DATE_PARSER = (v) => new Date(v);
const NOW = Date.now;

export default ({ path = [], ...rest } = {}) => ({
  multiple: false, // whether to stop after a single error at a given path
  abortEarly: true, // whether to stop after a single error anywhere in the schema
  sync: false, // whether validation will be synchronous (see assert)
  contextPrefix: '$', // how to reference context
  context: {}, // can be used in conditions/refs
  strict: false, // whether to run transforms
  assert: true, // whether to validate,
  dateParser: DATE_PARSER,
  now: NOW,
  path,
  ...rest,
});
