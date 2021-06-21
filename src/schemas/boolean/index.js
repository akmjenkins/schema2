import { createTypeCheck, includeTransforms } from '../../utils';
import * as booleanTransforms from './transforms';

const booleanTypeCheck = createTypeCheck(
  (val) => val instanceof Boolean || typeof val === 'boolean',
);

export const schema = {
  transforms: ['booleanTransform'],
  tests: ['booleanTypeCheck'],
};

export const tests = { booleanTypeCheck };
export const transforms = includeTransforms(booleanTransforms, ['boolean']);
