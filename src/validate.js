import settle from './settle';
import defaults from './defaults';
import is from './is';
export default (schema, value, options) =>
  settle(schema, value, { ...defaults(options), is, assert: true });
