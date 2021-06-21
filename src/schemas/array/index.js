import { createTypeCheck, includeTransforms } from '../../utils';
import * as arrayTransforms from './transforms';

const arrayTypeCheck = createTypeCheck(Array.isArray);

export const schema = {
  transforms: ['arrayTransform'],
  tests: ['arrayTypeCheck'],
};

export const tests = { arrayTypeCheck };
export const transforms = includeTransforms(arrayTransforms, ['array']);
