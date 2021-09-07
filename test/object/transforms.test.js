import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('object - transforms', () => {
  const createSchema = createSchemaCreator('object');

  it('should base transform', () => {
    const schema = createSchema();

    expect(() => cast(schema, '')).toThrowError();
    expect(cast(schema, '{"first":"second"}')).toEqual({
      first: 'second',
    });
    expect(cast(schema, {})).toEqual({});
    expect(() => cast(schema, [])).toThrowError();
  });

  it('should allow keys', () => {
    const type = 'only';
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
    expect(cast(schema, subject)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should exclude keys', () => {
    const type = 'except';
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
    expect(cast(schema, subject)).toEqual({ d: 5 });
  });

  it('should stripUnknown', () => {
    const type = 'stripUnknown';
    const schema = createSchema({
      inner: {
        a: { type: 'mixed' },
        b: { type: 'mixed' },
        c: { type: 'mixed' },
      },
      transforms: [{ type }],
    });
    const subject = { a: 1, b: 2, c: 3, d: 5 };
    expect(cast(schema, subject)).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('should transform keys', () => {
    const type = 'keys';
    const schema = createSchema({
      transforms: [
        {
          type,
          schema: { type: 'string', transforms: [{ type: 'uppercase' }] },
        },
      ],
    });
    const subject = { a: 1, b: 2, c: 3, d: 5 };
    expect(cast(schema, subject)).toEqual({ A: 1, B: 2, C: 3, D: 5 });
  });
});
