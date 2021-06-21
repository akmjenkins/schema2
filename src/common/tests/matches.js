import { createValidator, isRef } from '../../utils';

export default createValidator(
  ([regexp, flags], error) => (value, { resolve }, passError) => {
    new RegExp(resolve(regexp), flags).test(value) ||
      passError(error, {
        params: { value: isRef(regexp) ? regexp.ref : regexp },
      });
  },
  {
    onlySchemas: ['string'],
  },
);
