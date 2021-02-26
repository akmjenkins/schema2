import { createValidator } from '../utils';

export default createValidator(
  (error) => (value, _, passError) =>
    value.length === new Set(value).size || passError(error),
  {
    allowSchemas: ['array'],
  },
);
