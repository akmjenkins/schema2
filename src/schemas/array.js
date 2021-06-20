import { createTypeCheck, includeTransforms } from '../utils';
import arrayTypeCheck from '../tests/types/array';
import * as arrayTransforms from '../transforms/array';

export const schema = {
  transforms: ['arrayTransform'],
  tests: ['arrayTypeCheck'],
};

export const tests = { arrayTypeCheck: createTypeCheck(arrayTypeCheck) };
export const transforms = includeTransforms(arrayTransforms, ['array']);
