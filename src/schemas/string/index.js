import { createTypeCheck, includeTransforms } from '../../utils';
import * as stringTransforms from './transforms';
const stringTypeCheck = createTypeCheck((v) => typeof v === 'string');

export const schema = {
  transforms: ['stringTransform'],
  tests: ['stringTypeCheck'],
};

export const tests = { stringTypeCheck };
export const transforms = includeTransforms(stringTransforms, ['string']);
