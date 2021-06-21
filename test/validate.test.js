import { all } from '../src';
const { validate } = all;

describe('validate', () => {
  it('should validate a string', async () => {
    await expect(
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
      ),
    ).rejects.toThrow('2 errors occurred during validation');
  });
});
