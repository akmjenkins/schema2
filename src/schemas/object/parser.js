import { hasOwnProp, canBailOut } from '../../utils';

export default ({ inner = {} }, value = {}, options, check) =>
  Object.entries(inner).reduce(
    (acc, [key, schemaOrRef]) => {
      if (canBailOut(options, acc.results)) return acc;
      const { value, results } = check(schemaOrRef, acc.value[key], key);
      return {
        value:
          value !== undefined || hasOwnProp(acc.value, key)
            ? { ...acc.value, [key]: value }
            : acc.value,
        results: [...acc.results, ...results],
      };
    },
    { value, results: [] },
  );
