import { capitalize } from '../../utils';

export default ({ all, except, only }) =>
  (value) =>
    value
      .split(' ')
      .map((str, i) => {
        if (all) return capitalize(str);
        const toTest = str.trim();
        if (except)
          return new RegExp(except).test(toTest) ? str : capitalize(str);
        if (only) return new RegExp(only).test(toTest) ? capitalize(str) : str;
        return i === 0 ? capitalize(str) : str;
      })
      .join(' ');
