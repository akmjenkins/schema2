import { hasOwnProp } from '../../../utils';

export default () => (params) => (value, { resolve, is, createError }) => {
  if (hasOwnProp(params, 'value')) {
    const resolved = { value: resolve(params.value) };
    return value.includes(resolved.value) || createError({ resolved });
  }

  if (hasOwnProp(params, 'where'))
    return value.some((v) => is(params.where, v)) || createError();

  throw new Error(
    'Expected one of `value` or `where` to be supplied to `includes` validator',
  );
};
