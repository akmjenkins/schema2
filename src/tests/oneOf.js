import { createValidator } from '../utils';

export default createValidator(
  (values, error) => (value, { resolve }, passError) => {
    const resolved = values.map(resolve);
    return (
      resolved.includes(value) ||
      passError(error, { params: { values: resolved } })
    );
  },
  {
    onlySchemas: ['string'],
  },
);
