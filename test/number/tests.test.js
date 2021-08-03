import number from '../../src/schemas/number';
import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('number - tests', () => {
  const createSchema = createSchemaCreator('number');
  const createOptions = createOptionsCreator({ number });
  it('should validate', async () => {
    await expect(validate(createSchema(), 9, createOptions())).resolves.toBe(9);
  });

  it('should typeError', async () => {
    const errors = await getErrorsAsync(
      createSchema({ typeError: 'not a number' }),
      'fred',
      createOptions(),
    );

    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ message: 'not a number' }),
    );
  });
});
