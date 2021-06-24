import { hasOwnProp } from '../../../utils';

export default (params) => (value, { resolve, is, createError }) => {
  if (hasOwnProp(params, 'schemas'))
    return params.schemas.filter((s) => is(s, value)).length === 0;

  if (hasOwnProp(params, 'values')) {
    const resolved = { values: params.values.map(resolve) };
    return (
      resolved.values.some((v) => v === value) &&
      createError({ params: { resolved } })
    );
  }

  throw new Error(
    'Expected one of `schemas` or `values` to be supplied to `notOneOf` validator',
  );
};
