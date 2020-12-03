import { createValidator, isRef } from '../utils';

export default createValidator(
  ([num, { where, inclusive = true } = {}], error) => (
    value,
    { resolve, schemaType, is },
    passError,
  ) => {
    const resolved = resolve(num);
    const resolvedWhere = where ? resolve(where) : where;
    const params = { value: isRef(num) ? num.ref : num };
    switch (schemaType) {
      case 'string':
        return inclusive
          ? value.length >= resolved
          : value.length > resolved || passError(error, { params });
      case 'number':
        return inclusive
          ? value >= resolved
          : value > resolved || passError(error, { params });
      case 'array': {
        // allow validating an array to make sure it's contents contain
        const v = resolvedWhere
          ? value.filter((e) => is(resolvedWhere, e))
          : value;
        return inclusive
          ? v.length >= resolved
          : v.length > resolved || passError(error, { params });
      }
    }
  },
  {
    allowSchemas: ['string', 'number', 'array'],
  },
);
