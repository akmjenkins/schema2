import object from '../../src/schemas/object';
import string from '../../src/schemas/string';
import mixed from '../../src/schemas/mixed';
import { cast } from '../../src';
import { createSchemaCreator, createOptionsCreator } from '../fixtures';

describe('object - transforms', () => {
  const createSchema = createSchemaCreator('object');
  const createOptions = createOptionsCreator({ object });

  it('should base transform', () => {
    const schema = createSchema();
    const options = createOptions();
    expect(() => cast(schema, '', options)).toThrowError();
    expect(cast(schema, '{"first":"second"}', options)).toEqual({
      first: 'second',
    });
    expect(cast(schema, {}, options)).toEqual({});
    expect(() => cast(schema, [], options)).toThrowError();
  });

  it('should allow keys', () => {
    const type = 'only';
    const options = createOptions({ schemas: { string } });
    const schema = createSchema({
      transforms: [
        {
          type,
          where: {
            type: 'string',
            tests: [{ type: 'matches', pattern: '^[abc]' }],
          },
        },
      ],
    });

    const subject = { a: 1, b: 2, c: 3, d: 5 };
    expect(cast(schema, subject, options)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should exclude keys', () => {
    const type = 'except';
    const options = createOptions({ schemas: { string } });
    const schema = createSchema({
      transforms: [
        {
          type,
          where: {
            type: 'string',
            tests: [{ type: 'matches', pattern: '^[abc]' }],
          },
        },
      ],
    });

    const subject = { a: 1, b: 2, c: 3, d: 5 };
    expect(cast(schema, subject, options)).toEqual({ d: 5 });
  });

  it('should stripUnknown', () => {
    const type = 'stripUnknown';
    const options = createOptions({ schemas: { mixed } });
    const schema = createSchema({
      inner: {
        a: { type: 'mixed' },
        b: { type: 'mixed' },
        c: { type: 'mixed' },
      },
      transforms: [{ type }],
    });
    const subject = { a: 1, b: 2, c: 3, d: 5 };
    expect(cast(schema, subject, options)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should transform keys', () => {
    const type = 'keys';
    const options = createOptions({ schemas: { string } });
    const schema = createSchema({
      transforms: [
        {
          type,
          schema: { type: 'string', transforms: [{ type: 'uppercase' }] },
        },
      ],
    });
    const subject = { a: 1, b: 2, c: 3, d: 5 };
    expect(cast(schema, subject, options)).toEqual({ A: 1, B: 2, C: 3, D: 5 });
  });
});
