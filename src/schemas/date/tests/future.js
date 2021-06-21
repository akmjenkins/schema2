import { Date as SDate } from 'sugar-date';
import { createValidator } from '../../../utils';

export default createValidator(
  (error) => (value, _, passError) =>
    new SDate(value).isFuture().raw || passError(error),
  { allowSchemas: ['date'] },
);
