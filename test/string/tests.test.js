import string from '../../src/schemas/string';
import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('string - tests', () => {
  const schemas = { string };
  const createSchema = createSchemaCreator('string');
  const createOptions = createOptionsCreator({ string });

  it('should validate required', async () => {
    const type = 'required';
    const schema = createSchema({ tests: [{ type }] });
    const options = createOptions();
    const errors = getErrorsAtPath(await getErrorsAsync(schema, '', options));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    // required, but has a length
    expect(validate(schema, ' ', { ...options, sync: true })).toBe(' ');
  });

  it('should validate includes', async () => {
    const type = 'includes';
    const schema = createSchema({ tests: [{ type, value: 'asdf' }] });
    const options = createOptions();
    const errors = getErrorsAtPath(await getErrorsAsync(schema, '', options));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(
      validate(schema, 'blahblahasdfblahblah', { ...options, sync: true }),
    ).toBe('blahblahasdfblahblah');
  });

  it('should validate includes with a context ref value', async () => {
    const type = 'includes';
    const schema = createSchema({ tests: [{ type, value: { ref: '$a' } }] });
    const options = createOptions({ context: { a: 'asdf' } });
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
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'longer than 4', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { ...options, sync: true })).toBe('four');
  });

  it('should validate length with a context ref', async () => {
    const type = 'length';
    const schema = createSchema({ tests: [{ type, value: { ref: '$a.b' } }] });
    const options = createOptions({ context: { a: { b: 4 } } });
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
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'two', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { ...options, sync: true })).toBe('four');
  });

  it('should validate min (exclusive)', async () => {
    const type = 'min';
    const schema = createSchema({
      tests: [{ type, value: 4, inclusive: false }],
    });
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'four', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'seven', { ...options, sync: true })).toBe('seven');
  });

  it('should validate max', async () => {
    const type = 'max';
    const schema = createSchema({ tests: [{ type, value: 4 }] });
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'seven', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { ...options, sync: true })).toBe('four');
  });

  it('should validate max (exclusive)', async () => {
    const type = 'max';
    const schema = createSchema({
      tests: [{ type, value: 4, inclusive: false }],
    });
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'four', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'two', { ...options, sync: true })).toBe('two');
  });

  it('should validate between', async () => {
    const type = 'between';
    const schema = createSchema({ tests: [{ type, min: 4, max: 6 }] });
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'two', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'four', { ...options, sync: true })).toBe('four');
  });

  it('should validate between (exclusive)', async () => {
    const type = 'between';
    const schema = createSchema({
      tests: [{ type, min: 4, max: 6, inclusive: false }],
    });
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'four', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'seven', { ...options, sync: true })).toBe('seven');
  });

  it('should validate matches', async () => {
    const type = 'matches';
    const schema = createSchema({
      tests: [{ type, pattern: '[aeiou]', flags: 'i' }],
    });
    const options = createOptions();
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'rhythm', options),
    );
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type }));

    expect(validate(schema, 'TONGUE', { ...options, sync: true })).toBe(
      'TONGUE',
    );
  });
});
