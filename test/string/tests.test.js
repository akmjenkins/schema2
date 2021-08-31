import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
} from '../fixtures';

describe('string - tests', () => {
  const createSchema = createSchemaCreator('string');

  it('should validate required', async () => {
    const type = 'required';
    const schema = createSchema({ tests: [{ type }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, ''));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    // required, but has a length
    expect(validate(schema, ' ', { sync: true })).toBe(' ');
  });

  it('should validate includes', async () => {
    const type = 'includes';
    const schema = createSchema({ tests: [{ type, value: 'asdf' }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, ''));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'blahblahasdfblahblah', { sync: true })).toBe(
      'blahblahasdfblahblah',
    );
  });

  it('should validate includes with a context ref value', async () => {
    const type = 'includes';
    const schema = createSchema({ tests: [{ type, value: { ref: '$a' } }] });
    const options = { context: { a: 'asdf' } };
    const errors = getErrorsAtPath(await getErrorsAsync(schema, '', options));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(
      validate(schema, 'blahblahasdfblahblah', { ...options, sync: true }),
    ).toBe('blahblahasdfblahblah');
  });

  it('should validate length', async () => {
    const type = 'length';
    const schema = createSchema({ tests: [{ type, value: 4 }] });
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'longer than 4'),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { sync: true })).toBe('four');
  });

  it('should validate length with a context ref', async () => {
    const type = 'length';
    const schema = createSchema({ tests: [{ type, value: { ref: '$a.b' } }] });
    const options = { context: { a: { b: 4 } } };
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'longer than 4', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { ...options, sync: true })).toBe('four');
  });

  it('should validate min', async () => {
    const type = 'min';
    const schema = createSchema({ tests: [{ type, value: 4 }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'two'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { sync: true })).toBe('four');
  });

  it('should validate min (exclusive)', async () => {
    const type = 'min';
    const schema = createSchema({
      tests: [{ type, value: 4, inclusive: false }],
    });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'four'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'seven', { sync: true })).toBe('seven');
  });

  it('should validate max', async () => {
    const type = 'max';
    const schema = createSchema({ tests: [{ type, value: 4 }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'seven'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { sync: true })).toBe('four');
  });

  it('should validate max (exclusive)', async () => {
    const type = 'max';
    const schema = createSchema({
      tests: [{ type, value: 4, inclusive: false }],
    });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'four'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'two', { sync: true })).toBe('two');
  });

  it('should validate between', async () => {
    const type = 'between';
    const schema = createSchema({ tests: [{ type, min: 4, max: 6 }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'two'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { sync: true })).toBe('four');
  });

  it('should validate between (exclusive)', async () => {
    const type = 'between';
    const schema = createSchema({
      tests: [{ type, min: 4, max: 6, inclusive: false }],
    });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'four'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'seven', { sync: true })).toBe('seven');
  });

  it('should validate matches', async () => {
    const type = 'matches';
    const schema = createSchema({
      tests: [{ type, pattern: '[aeiou]', flags: 'i' }],
    });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, 'rhythm'));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'TONGUE', { sync: true })).toBe('TONGUE');
  });
});
