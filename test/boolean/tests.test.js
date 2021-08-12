import boolean from '../../src/schemas/boolean';
import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('boolean - tests', () => {
  const createSchema = createSchemaCreator('boolean');
  const createOptions = createOptionsCreator({ boolean });
  it('should validate', async () => {
    await expect(
      validate(createSchema(), 'true', createOptions()),
    ).resolves.toBe(true);
  });

  it('should typeError', async () => {
    const errors = await getErrorsAsync(
      createSchema({ typeError: 'not a boolean' }),
      'fred',
      createOptions(),
    );

    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ message: 'not a boolean' }),
    );
  });
});
