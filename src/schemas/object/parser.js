import { hasOwnProp, canBailOut } from '../../utils';

export default ({ inner = {} }, value = {}, options, check) => {
  return Object.entries(inner).reduce(
    (acc, [key, schemaOrRef]) => {
      if (canBailOut(options, acc.results)) return acc;
      const { value, results } = check(schemaOrRef, acc.value[key], key);
      return {
        value:
          value || hasOwnProp(acc.value, key)
            ? { ...acc.value, [key]: value }
            : acc.value,
        results: [...acc.results, ...results],
      };
    },
    { value, results: [] },
  );
};
