import { createTypeCheck, includeTransforms } from '../utils';
import * as numberTransforms from '../transforms/number';
import numberTypeCheck from '../tests/types/number';

export const schema = {
  transforms: ['numberTransform'],
  tests: ['numberTypeCheck'],
};

export const tests = { numberTypeCheck: createTypeCheck(numberTypeCheck) };
export const transforms = includeTransforms(numberTransforms, ['number']);
