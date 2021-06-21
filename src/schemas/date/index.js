import { createTypeCheck, includeTransforms } from '../../utils';
import * as dateTransforms from './transforms';
import * as dateTests from './tests';

const dateTypeCheck = createTypeCheck(
  (val) => val instanceof Date && !isNaN(val.getTime()),
);

export const schema = {
  transforms: ['dateTransform'],
  tests: ['dateTypeCheck'],
};

export const tests = { dateTypeCheck, ...dateTests };
export const transforms = includeTransforms(dateTransforms, ['date']);
