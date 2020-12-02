import { isObject } from 'util';
import { createTypeCheck } from '../utils';

const objectTransform = () => (value) => {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = null;
    }
  }

  return value && isObject(value) ? value : null;
};

const objectTypeCheck = createTypeCheck(isObject);

export const schema = {
  transforms: ['objectTransform'],
  tests: ['objectTypeCheck'],
};

export const tests = {
  objectTypeCheck,
};

export const transforms = { objectTransform };
