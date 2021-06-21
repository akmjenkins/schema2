import { createValidator } from '../../utils';

export default createValidator(
  (against, error) => (value, { resolve }, passError) => {
    const resolved = resolve({ ref: against });
    return (
      value === resolved || passError(error, { params: { value: against } })
    );
  },
);
