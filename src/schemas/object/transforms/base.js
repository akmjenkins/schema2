import { isObject } from '../utils';

export default () => (value) => {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (err) {
      value = null;
    }
  }

  return value && isObject(value) ? value : null;
};
