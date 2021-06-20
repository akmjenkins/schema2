import { createTypeCheck, includeTransforms } from '../utils';
import * as objectTransforms from '../transforms/object';
import objectTypeCheck from '../tests/types/object';

export const schema = {
  transforms: ['objectTransform'],
  tests: ['objectTypeCheck'],
};

export const tests = { objectTypeCheck: createTypeCheck(objectTypeCheck) };
export const transforms = includeTransforms(objectTransforms, ['object']);
