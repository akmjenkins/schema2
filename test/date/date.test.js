import { Date as SDate } from 'sugar-date';
import createDateSchema from '../../src/schemas/date';
import { validate, cast } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('date - tests', () => {
  const createSchema = createSchemaCreator('date');
  const createOptions = createOptionsCreator({
    date: createDateSchema({ parser: SDate.create }),
  });

  it('should validate typeError', async () => {
    const schema = createSchema({ typeError: 'couldnt parse date' });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'then', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({
        type: 'typeCheck',
        message: 'couldnt parse date',
      }),
    );

    await expect(validate(schema, 'now', options)).resolves.toBeInstanceOf(
      Date,
    );
  });

  it('should validate past', async () => {
    const type = 'past';
    const schema = createSchema({ tests: [{ type: 'past' }] });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'tomorrow', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 'yesterday', options)).resolves.toEqual(
      SDate.create('yesterday'),
    );
  });

  it('should validate future', async () => {
    const type = 'future';
    const schema = createSchema({ tests: [{ type: 'future' }] });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 'tomorrow', options)).resolves.toEqual(
      SDate.create('tomorrow'),
    );
  });
});
