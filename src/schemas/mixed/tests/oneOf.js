import { hasOwnProp } from '../../../utils';

export default (params) => (value, { resolve, is, createError }) => {
  if (hasOwnProp(params, 'schemas'))
    return params.schemas.some((s) => is(s, value));

  if (hasOwnProp(params, 'values')) {
    const resolved = { values: params.values.map(resolve) };
    return (
      resolved.some((v) => v === value) || createError({ params: { resolved } })
    );
  }

  throw new Error(
    'Expected one of `schemas` or `values` to be supplied to `oneOf` validator',
  );
};
