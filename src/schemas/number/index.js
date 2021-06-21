import { createTypeCheck, includeTransforms } from '../../utils';
import * as numberTransforms from './transforms';
import * as numberTests from './tests';

const numberTypeCheck = createTypeCheck(
  (val) => val instanceof Number || (typeof val === 'number' && !isNaN(val)),
);

export const schema = {
  transforms: ['numberTransform'],
  tests: ['numberTypeCheck'],
};

export const tests = { numberTypeCheck, ...numberTests };
export const transforms = includeTransforms(numberTransforms, ['number']);
