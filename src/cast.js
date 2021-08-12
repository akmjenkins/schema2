import { settle, defaults } from './core';
import is from './is';

const cast = (schema, value, options) =>
  settle(schema, value, {
    ...defaults(options),
    coerce: true,
    is,
    cast,
    sync: true,
    assert: false,
  });

export default cast;
