import { validate } from '../../src';
import {
  createSchemaCreator,
  getErrorsAsync,
  getErrorsAtPath,
} from '../fixtures';

describe('object - tests', () => {
  const createSchema = createSchemaCreator('object');

  it('should typeCheck', async () => {
    const type = 'typeCheck';
    expect(
      getErrorsAtPath(await getErrorsAsync(createSchema(), '')),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should required', async () => {
    const type = 'required';
    const schema = createSchema({
      tests: [{ type, keys: ['a', 'b', 'c'] }],
    });
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, { a: 1, b: 2 })),
    ).toContainEqual(expect.objectContaining({ type }));

    const value = { a: 1, b: 2, c: 3 };
    await expect(validate(schema, value)).resolves.toEqual(value);
  });

  it('should allowUnknown', async () => {
    const type = 'allowUnknown';
    const schema = createSchema({
      inner: { a: { type: 'mixed' }, b: { type: 'mixed' } },
      tests: [{ type }],
    });
    const subject = { a: 1, b: 2, c: 3 };
    expect(await validate(schema, subject)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should not allowUnknown', async () => {
    const type = 'allowUnknown';
    const schema = createSchema({
      inner: { a: { type: 'mixed' }, b: { type: 'mixed' } },
      tests: [{ type, value: false }],
    });
    const subject = { a: 1, b: 2, c: 3 };
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, subject)),
    ).toContainEqual(expect.objectContaining({ type }));

    expect(await validate(schema, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('should match keys to a schema', async () => {
    const type = 'keys';
    const schema = createSchema({
      tests: [
        {
          type,
          schema: {
            type: 'string',
            tests: [{ type: 'matches', pattern: '^[abc]' }],
          },
        },
      ],
    });

    expect(await validate(schema, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, { d: 'f' })),
    ).toContainEqual(expect.objectContaining({ type }));
  });
});
