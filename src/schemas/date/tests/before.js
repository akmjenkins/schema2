import { Date as SDate } from 'sugar-date';
import { createValidator, isRef } from '../../../utils';

export default createValidator(
  (date, error) => (value, { resolve }, passError) => {
    const params = { value: isRef(date) ? date.ref : date };
    const reference = new SDate(resolve(date));
    if (!reference.isValid().raw)
      throw new Error(
        `Could not convert ${date} to a valid date for comparison purposes`,
      );

    return (
      new SDate(value).isBefore(reference).raw || passError(error, { params })
    );
  },
  {
    allowSchemas: ['date'],
  },
);
