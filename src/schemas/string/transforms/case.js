import { capitalize } from '../../utils';

const CASES = {
  pascal: (value) => value.split(' ').map(capitalize).join(''),
  kebab: (value) => value.replace(' ', '-'),
  snake: (value) => value.replace(' ', '_'),
  camel: (value) =>
    value
      .split(' ')
      .map((s, i) => (i === 0 ? s : capitalize(s)))
      .join(''),
};

export default ({ type }) =>
  (value) => {
    const fn = CASES[type];
    if (!fn)
      throw new Error('type must be one of pascal, kebab, snake, or camel');
    return fn(value);
  };
