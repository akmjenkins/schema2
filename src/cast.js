import { settle, defaults } from './core';
import is from './is';

export default (schema, value, options) =>
  settle(schema, value, {
    ...defaults(options),
    coerce: true,
    is,
    sync: true,
    assert: false,
  });
