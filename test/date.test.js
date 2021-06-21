import { parseISO } from 'date-fns';
import { all, createTransform } from '../src';
const { validate, cast } = all;

describe('validate', () => {
  it('should validate a string', async () => {
    const f = validate(
      { type: 'date', tests: [['before', '1 year ago']] },
      '2019-12-20',
      {
        sync: true,
      },
    );
    console.log(f);
  });
});
