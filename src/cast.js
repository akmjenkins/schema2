import settle from './settle';
import is from './is';
import defaults from './defaults';

export default (schema, value, options) =>
  settle(schema, value, {
    ...defaults(options),
    coerce: true,
    is,
    assert: false,
  });
