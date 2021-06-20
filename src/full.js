import all from './include.all';
import { cast as c, is as i, validate as v } from './index';

export const cast = (schema, value, options) => c(schema, value, all(options));
export const is = (schema, value, options) => i(schema, value, all(options));
export const validate = (schema, value, options) =>
  v(schema, value, all(options));
