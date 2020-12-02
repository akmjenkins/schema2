import { createTypeCheck } from '../utils';

const numberTransform = () => (value) => {
  if (typeof value === 'string') {
    const next = value.replace(/\s/g, '');
    if (!next) return NaN;
    return +next;
  }
  return parseFloat(value);
};
const numberTypeCheck = createTypeCheck(
  (val) => val instanceof Number || (typeof val === 'number' && !isNaN(val)),
);

export const schema = {
  transforms: ['numberTransform'],
  tests: ['numberTypeCheck'],
};

export const tests = { numberTypeCheck };

export const transforms = { numberTransform };
