import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
} from '../fixtures';

describe('boolean - tests', () => {
  const createSchema = createSchemaCreator('boolean');
  it('should validate', async () => {
    await expect(validate(createSchema(), 'true')).resolves.toBe(true);
  });

  it('should typeError', async () => {
    const errors = await getErrorsAsync(
      createSchema({ typeError: 'not a boolean' }),
      'fred',
    );

    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ message: 'not a boolean' }),
    );
  });
});
