import { validate } from '../src';

describe('validate', () => {
  it('should validate a string', async () => {
    validate(
      {
        type: 'string',
        tests: [
          ['not', 'asdf'],
          ['includes', 'joe'],
        ],
      },
      'asdf',
      {
        multiple: true,
        abortEarly: false,
      },
    );
  });
});
