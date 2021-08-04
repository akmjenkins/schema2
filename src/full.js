import { default as _cast } from './cast';
import { default as _validate } from './validate';
import { default as _is } from './is';
import * as schemas from './schemas';
export { ValidationError } from './core';

export const cast = (schema, value, options = {}) =>
  _cast(schema, value, { ...options, schemas });

export const validate = (schema, value, options = {}) =>
  _validate(schema, value, { ...options, schemas });

export const is = (schema, value, options = {}) =>
  _is(schema, value, { ...options, schemas });
