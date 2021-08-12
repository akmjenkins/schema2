import object from '../../src/schemas/object';
import mixed from '../../src/schemas/mixed';
import string from '../../src/schemas/string';
import { validate } from '../../src';
import {
  createSchemaCreator,
  createOptionsCreator,
  getErrorsAsync,
  getErrorsAtPath,
} from '../fixtures';

describe('object - tests', () => {
  const createSchema = createSchemaCreator('object');
  const createOptions = createOptionsCreator({ object });

  it('should typeCheck', async () => {
    const type = 'typeCheck';
    expect(
      getErrorsAtPath(
        await getErrorsAsync(createSchema(), '', createOptions()),
      ),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should required', async () => {
    const type = 'required';
    const options = createOptions();
    const schema = createSchema({
      tests: [{ type, keys: ['a', 'b', 'c'] }],
    });
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, { a: 1, b: 2 }, options)),
    ).toContainEqual(expect.objectContaining({ type }));

    const value = { a: 1, b: 2, c: 3 };
    await expect(validate(schema, value, options)).resolves.toEqual(value);
  });

  it('should allowUnknown', async () => {
    const type = 'allowUnknown';
    const options = createOptions({ schemas: { mixed } });
    const schema = createSchema({
      inner: { a: { type: 'mixed' }, b: { type: 'mixed' } },
      tests: [{ type }],
    });
    const subject = { a: 1, b: 2, c: 3 };
    expect(await validate(schema, subject, options)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it('should not allowUnknown', async () => {
    const type = 'allowUnknown';
    const options = createOptions({ schemas: { mixed } });
    const schema = createSchema({
      inner: { a: { type: 'mixed' }, b: { type: 'mixed' } },
      tests: [{ type, value: false }],
    });
    const subject = { a: 1, b: 2, c: 3 };
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, subject, options)),
    ).toContainEqual(expect.objectContaining({ type }));

    expect(await validate(schema, { a: 1, b: 2 }, options)).toEqual({
      a: 1,
      b: 2,
    });
  });

  it('should match keys to a schema', async () => {
    const type = 'keys';
    const options = createOptions({ schemas: { string } });
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

    expect(await validate(schema, { a: 1, b: 2 }, options)).toEqual({
      a: 1,
      b: 2,
    });

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, { d: 'f' }, options)),
    ).toContainEqual(expect.objectContaining({ type }));
  });
});
