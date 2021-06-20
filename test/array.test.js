import { all } from '../src/index';

const { cast, validate } = all;

describe('array', () => {
  it('should test', async () => {
    const f = () => new Promise((_, rej) => rej('error'));
    await expect(f()).rejects.toEqual('error');
  });

  it('should unique transform', () => {
    const schema = {
      type: 'array',
      transforms: ['unique'],
    };

    expect(cast(schema, [1, 2, 1, 2, 1, 2])).toEqual([1, 2]);
  });

  it('should unique transform objects', () => {
    const schema = {
      type: 'array',
      transforms: [['unique', 'firstName']],
    };

    expect(
      cast(schema, [
        {
          firstName: 'Barney',
          lastName: 'Rubble',
        },
        {
          firstName: 'Barney',
          lastName: 'Stinson',
        },
      ]),
    ).toEqual([{ firstName: 'Barney', lastName: 'Rubble' }]);
  });

  it('should compact arrays', () => {
    const schema = {
      type: 'array',
      transforms: ['compact'],
    };
    expect(cast(schema, [1, null, 2, null])).toEqual([1, 2]);
  });

  it('should compact arrays using a schema', () => {
    const schema = {
      type: 'array',
      transforms: [
        [
          'compact',
          {
            type: 'object',
            inner: { firstName: { tests: [['is', 'Barney']] } },
          },
        ],
      ],
    };
    expect(
      cast(schema, [
        {
          firstName: 'Barney',
          lastName: 'Rubble',
        },
        {
          firstName: 'Fred',
          lastName: 'Flintstone',
        },
      ]),
    ).toEqual([
      {
        firstName: 'Fred',
        lastName: 'Flintstone',
      },
    ]);
  });

  it('should unique validate', async () => {
    await expect(
      validate(
        {
          type: 'array',
          tests: ['unique'],
        },
        ['a', 'a'],
      ),
    ).rejects.toThrow('field must only contain unique elements');

    await expect(
      validate(
        {
          type: 'array',
          tests: ['unique'],
        },
        ['a', 'b'],
      ),
    ).resolves.toEqual(['a', 'b']);

    await expect(
      validate(
        {
          type: 'array',
          tests: [['unique', { by: 'a' }]],
        },
        [{ a: 1 }, { a: 1 }],
      ),
    ).rejects.toThrow('field must only contain unique elements');

    await expect(
      validate(
        {
          type: 'array',
          tests: [['unique', { by: 'b' }]],
        },
        [
          { a: 1, b: 1 },
          { a: 1, b: 2 },
        ],
      ),
    ).resolves.toEqual([
      { a: 1, b: 1 },
      { a: 1, b: 2 },
    ]);
  });
});
