import { hasOwnProp } from '../../utils';

export default ({ inner }, value, check, canBail) => {
  return Object.entries(inner).reduce(
    (acc, [key, schemaOrRef]) => {
      if (canBail(acc.results)) return acc;
      const { value, results } = check(schemaOrRef, acc.value[key], key);
      return {
        value:
          value || hasOwnProp(acc.value, key)
            ? { ...acc.value, [key]: value }
            : acc.value,
        results: [...acc.results, ...results],
      };
    },
    { value: value || {}, results: [] },
  );
};
