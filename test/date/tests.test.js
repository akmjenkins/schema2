import { Date as SDate } from 'sugar-date';
import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
} from '../fixtures';

describe('date - tests', () => {
  const dateParser = (date) => SDate.create(date, { fromUTC: true });
  const createSchema = createSchemaCreator('date');
  const options = { dateParser };

  it('should validate typeError', async () => {
    const schema = createSchema({ typeError: 'couldnt parse date' });
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
    const errors = await getErrorsAsync(schema, 'tomorrow', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 'yesterday', options)).resolves.toEqual(
      dateParser('yesterday'),
    );
  });

  it('should validate future', async () => {
    const type = 'future';
    const schema = createSchema({ tests: [{ type }] });
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 'tomorrow', options)).resolves.toEqual(
      dateParser('tomorrow'),
    );
  });

  it('should validate max', async () => {
    const type = 'max';
    const schema = createSchema({ tests: [{ type, value: 'yesterday' }] });
    const errors = await getErrorsAsync(schema, 'now', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    const str = 'last Tuesday';
    await expect(validate(schema, str, options)).resolves.toEqual(
      dateParser(str),
    );
    const badSchema = createSchema({ tests: [{ type, value: 'flarfen' }] });
    await expect(validate(badSchema, str, options)).rejects.toThrow(
      'Could not convert flarfen (resolved: flarfen) to a valid date for comparison purposes',
    );
  });

  it('should validate min', async () => {
    const type = 'min';
    const schema = createSchema({ tests: [{ type, value: 'now' }] });
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    const str = 'next Tuesday';
    await expect(validate(schema, str, options)).resolves.toEqual(
      dateParser(str),
    );

    const badSchema = createSchema({ tests: [{ type, value: 'flarfen' }] });
    await expect(validate(badSchema, str, options)).rejects.toThrow(
      'Could not convert flarfen (resolved: flarfen) to a valid date for comparison purposes',
    );
  });

  it('should validate between', async () => {
    const type = 'between';
    const schema = createSchema({
      tests: [{ type, min: '1 hour ago', max: 'now' }],
    });
    const errors = await getErrorsAsync(schema, 'yesterday', options);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    const str = '30 minutes ago';
    await expect(validate(schema, str, options)).resolves.toEqual(
      dateParser(str),
    );
  });
});
