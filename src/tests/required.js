import { createValidator } from '../utils';

export default createValidator(
  (error) => (value, { schemaType }, passError) => {
    switch (schemaType) {
      case 'array':
      case 'string':
        return !!(value && value.length > 0) || passError(error);
      default:
        return value !== null || passError(error);
    }
  },
  {
    allowUndefined: true,
    allowNull: true,
  },
);
