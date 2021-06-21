import { createTypeCheck, includeTransforms, isObject } from '../../utils';
import * as objectTransforms from './transforms';
const objectTypeCheck = createTypeCheck(isObject);

export const schema = {
  transforms: ['objectTransform'],
  tests: ['objectTypeCheck'],
};

export const tests = { objectTypeCheck };
export const transforms = includeTransforms(objectTransforms, ['object']);
