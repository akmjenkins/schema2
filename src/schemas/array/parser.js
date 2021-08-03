import { canBailOut } from '../../utils';
export default ({ inner }, value = [], options, check) => {
  const isTuple = Array.isArray(inner);
  return (isTuple ? inner : value).reduce(
    (acc, schemaOrRef, idx) => {
      if (canBailOut(options, acc.results)) return acc;
      const { value, results } = check(
        isTuple ? schemaOrRef : inner,
        value[idx],
        idx,
      );

      return {
        value: Array.isArray(acc.value) ? [...acc.value, value] : acc.value,
        results: [...acc.results, ...results],
      };
    },
    { value: [], results: [] },
  );
};