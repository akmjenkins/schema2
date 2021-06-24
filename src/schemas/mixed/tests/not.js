import { hasOwnProp } from '../../../utils';

export default (params) => (value, { resolve, is, createError }) => {
  if (hasOwnProp(params, 'value')) {
    const resolved = { value: resolve(params.value) };
    return value !== params.value || createError({ params: { resolved } });
  }

  if (hasOwnProp(params, 'schema')) return !is(params.schema, value);

  throw new Error(
    'Expected one of `vaue` or `schema` to be supplied to is validator',
  );
};
