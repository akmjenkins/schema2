import { createTypeCheck, includeTransforms } from '../utils';
import booleanTypeCheck from '../tests/types/boolean';
import * as booleanTransforms from '../transforms/boolean';

export const schema = {
  transforms: ['booleanTransform'],
  tests: ['booleanTypeCheck'],
};

export const tests = { booleanTypeCheck: createTypeCheck(booleanTypeCheck) };
export const transforms = includeTransforms(booleanTransforms, ['boolean']);
