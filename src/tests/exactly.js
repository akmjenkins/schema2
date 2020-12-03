import { createValidator, isRef } from '../utils';

/**
 *
 * {
 *  type:'array',
 *  tests: [
 *    [
 *      'exactly',
 *      [
 *        1,
 *        {
 *          ref: '$schemasInContext.mySchema'
 *        }
 *      ]
 *     ]
 *   ]
 * }
 *
 *
 */

export default createValidator(
  ([num, where], error) => (value, { resolve, schemaType, is }, passError) => {
    const resolved = resolve(num);
    const resolvedWhere = where ? resolve(where) : where;
    const params = { value: isRef(num) ? num.ref : num };
    switch (schemaType) {
      case 'string':
        return value.length === resolved || passError(error, { params });
      case 'array': {
        // allow validating an array to make sure it's contents contain
        const v = resolvedWhere
          ? value.filter((e) => is(resolvedWhere, e))
          : value;
        return v.length === resolved || passError(error, { params });
      }
    }
  },
  {
    allowSchemas: ['string', 'array'],
  },
);
