import { createValidator, isRef } from '../utils';

export default createValidator(
  (what, error) => (value, { resolve }, passError) => {
    const resolved = resolve(what);
    return (
      value.includes(resolved) ||
      passError(error, {
        params: { value: isRef(what) ? what.ref : resolved },
      })
    );
  },
  { onlySchemas: ['string', 'array'] },
);
