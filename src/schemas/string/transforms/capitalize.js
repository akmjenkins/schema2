import { capitalize } from '../../utils';

export default ({ all, except, only }) =>
  (value, { is }) => {
    return value
      .split(' ')
      .map((str, i) => {
        if (all) return capitalize(str);
        if (except)
          return is({ type: 'string', ...except }, str) ? str : capitalize(str);
        if (only)
          return is({ type: 'string', ...only }, str) ? capitalize(str) : str;
        return i === 0 ? capitalize(str) : str;
      })
      .join(' ');
  };
