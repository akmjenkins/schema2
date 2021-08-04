import { Date as SDate } from 'sugar-date';
import createDateSchema from '../../src/schemas/date';
import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('date - tests', () => {
  const parser = (date) => SDate.create(date, { fromUTC: true });
  const createSchema = createSchemaCreator('date');
  const createOptions = createOptionsCreator({
    date: createDateSchema({ parser }),
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
    const schema = createSchema({ tests: [{ type }] });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'tomorrow', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 'yesterday', options)).resolves.toEqual(
      parser('yesterday'),
    );
  });

  it('should validate future', async () => {
    const type = 'future';
    const schema = createSchema({ tests: [{ type }] });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 'tomorrow', options)).resolves.toEqual(
      parser('tomorrow'),
    );
  });

  it('should validate max', async () => {
    const type = 'max';
    const schema = createSchema({ tests: [{ type, value: 'yesterday' }] });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'now', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    const str = 'last Tuesday';
    await expect(validate(schema, str, options)).resolves.toEqual(parser(str));
  });

  it('should validate min', async () => {
    const type = 'min';
    const schema = createSchema({ tests: [{ type, value: 'now' }] });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    const str = 'next Tuesday';
    await expect(validate(schema, str, options)).resolves.toEqual(parser(str));
  });

  it('should validate between', async () => {
    const type = 'between';
    const schema = createSchema({
      tests: [{ type, min: '1 hour ago', max: 'now' }],
    });
    const options = createOptions();
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    const str = '30 minutes ago';
    await expect(validate(schema, str, options)).resolves.toEqual(parser(str));
  });
});
