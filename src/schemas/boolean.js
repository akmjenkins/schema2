import { createTypeCheck } from '../utils';

const booleanTransform = () => (value) => {
  if (/^(true|1)$/i.test(value)) return true;
  if (/^(false|0)$/i.test(value)) return false;
  return value;
};

const booleanTypeCheck = createTypeCheck(
  (val) => val instanceof Boolean || typeof val === 'boolean',
);

export const schema = {
  transforms: ['booleanTransform'],
  tests: ['booleanTypeCheck'],
};

export const tests = { booleanTypeCheck };

export const transforms = { booleanTransform };
export const typeChecks = { booleanTypeCheck };
