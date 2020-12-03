import { createValidator } from '../utils';

export default createValidator(
  (keys, error) => (value, { resolve }, passError) => {
    const missing = keys
      .map(resolve)
      .filter((k) => !Object.prototype.hasOwnProperty.call(value, k));

    return !missing.length || passError(error, { params: { missing } });
  },
  {
    onlySchemas: ['object'],
  },
);
