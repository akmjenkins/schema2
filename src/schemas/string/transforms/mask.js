export default ({ pattern = '.', character = '*', unmasked, start = true }) =>
  (value, { resolve }) => {
    const r = RegExp(resolve(pattern));
    const char = resolve(character);
    const mask = (i) => {
      if (!unmasked) return true;
      return start ? i < value.length - unmasked : i >= unmasked;
    };
    return value
      .split('')
      .map((c, i) => {
        if (!r.test(c)) return c;
        return mask(i) ? char : c;
      })
      .join('');
  };
