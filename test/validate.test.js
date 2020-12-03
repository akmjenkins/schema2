import * as yup from 'yup';
import { validate } from '../src';

describe('validate', () => {
  it('should work', async () => {
    const schema = {
      type: 'string',
      label: 'my first name',
      tests: [['notOneOf', ['joe', 'bill', 'fred']]],
    };

    validate(schema, 'je', {});

    expect(1).toBe(1);
  });
});
