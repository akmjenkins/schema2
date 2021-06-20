import { createTypeCheck, includeTransforms } from '../utils';
import * as stringTransforms from '../transforms/string';
import stringTypeCheck from '../tests/types/string';

export const schema = {
  transforms: ['stringTransform'],
  tests: ['stringTypeCheck'],
};

export const tests = { stringTypeCheck: createTypeCheck(stringTypeCheck) };
export const transforms = includeTransforms(stringTransforms, ['string']);
