import { createValidator, isRef } from '../../utils';

export default createValidator(
  (against, error) => (value, { resolve }, passError) => {
    const resolved = resolve(against);
    return (
      value !== resolved ||
      passError(error, {
        params: { value: isRef(against) ? against.ref : resolved },
      })
    );
  },
);
