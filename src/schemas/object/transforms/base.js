import { isObject } from '../../../utils';

export default () => (value) => {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = null;
    }
  }
  if (isObject(value)) return value;
  throw new TypeError(
    `'${value} could not be converted to a value that satisfied schema object`,
  );
};
