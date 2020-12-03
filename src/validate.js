import settle from './settle';
import defaults from './defaults';
export default (schema, value, options) =>
  settle(schema, value, { ...defaults(options), assert: true });
