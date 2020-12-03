import { createValidator, isRef } from '../utils';

export default createValidator(
  ([lower, upper, { where, inclusive = false } = {}], error) => (
    value,
    { resolve, schemaType, is },
    passError,
  ) => {
    const lowerBound = resolve(lower);
    const upperBound = resolve(upper);
    const resolvedWhere = where ? resolve(where) : where;
    const params = {
      lower: isRef(lower) ? lower.ref : lower,
      upper: isRef(upper) ? upper.ref : upper,
    };
    switch (schemaType) {
      case 'string':
        return (
          (inclusive
            ? value.length <= upperBound && value.length >= lowerBound
            : value.length < upperBound && value.length > lowerBound) ||
          passError(error, { params })
        );
      case 'number':
        return (
          (inclusive
            ? value <= upperBound && value >= lowerBound
            : value < upperBound && value > lowerBound) ||
          passError(error, { params })
        );
      case 'array': {
        // allow validating an array to make sure it's contents contain
        const v = resolvedWhere
          ? value.filter((e) => is(resolvedWhere, e))
          : value;
        return (
          (inclusive
            ? v.length <= upperBound && v.length >= lowerBound
            : v.length < upperBound && v.length > lowerBound) ||
          passError(error, { params })
        );
      }
    }
  },
  {
    allowSchemas: ['string', 'number', 'array'],
  },
);
