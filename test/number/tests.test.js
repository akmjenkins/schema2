import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
} from '../fixtures';

describe('number - tests', () => {
  const createSchema = createSchemaCreator('number');
  it('should validate', async () => {
    await expect(validate(createSchema(), 9)).resolves.toBe(9);
  });

  it('should typeError', async () => {
    const errors = await getErrorsAsync(
      createSchema({ typeError: 'not a number' }),
      'fred',
    );

    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ message: 'not a number' }),
    );
  });

  it('should test integer', async () => {
    const type = 'integer';
    const schema = createSchema({ tests: [{ type }] });
    const errors = await getErrorsAsync(schema, 9.5);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 9)).resolves.toBe(9);
  });

  it('should test multipleOf', async () => {
    const type = 'multipleOf';
    const schema = createSchema({ tests: [{ type, value: 7 }] });
    const errors = await getErrorsAsync(schema, 13);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 21)).resolves.toBe(21);
  });

  it('should test min', async () => {
    const type = 'min';
    const schema = createSchema({ tests: [{ type, value: 7 }] });
    const errors = await getErrorsAsync(schema, 4);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 21)).resolves.toBe(21);
  });

  it('should test min (exclusive)', async () => {
    const type = 'min';
    const schema = createSchema({
      tests: [{ type, value: 7, inclusive: false }],
    });
    const errors = await getErrorsAsync(schema, 7);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 21)).resolves.toBe(21);
  });

  it('should test max', async () => {
    const type = 'max';
    const schema = createSchema({ tests: [{ type, value: 7 }] });
    const errors = await getErrorsAsync(schema, 9);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 6)).resolves.toBe(6);
  });

  it('should test max (exclusive)', async () => {
    const type = 'max';
    const schema = createSchema({
      tests: [{ type, value: 9, inclusive: false }],
    });
    const errors = await getErrorsAsync(schema, 9);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 8)).resolves.toBe(8);
  });

  it('should test between', async () => {
    const type = 'between';
    const schema = createSchema({ tests: [{ type, min: 7, max: 12 }] });
    const errors = await getErrorsAsync(schema, 4);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 9)).resolves.toBe(9);
  });

  it('should test between (exclusive)', async () => {
    const type = 'between';
    const schema = createSchema({
      tests: [{ type, min: 7, max: 12, inclusive: false }],
    });
    const errors = await getErrorsAsync(schema, 7);
    expect(getErrorsAtPath(errors)[0]).toEqual(
      expect.objectContaining({ type }),
    );

    await expect(validate(schema, 9)).resolves.toBe(9);
  });
});
