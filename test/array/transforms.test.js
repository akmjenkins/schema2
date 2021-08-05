import * as yup from 'yup';
import array from '../../src/schemas/array';
import mixed from '../../src/schemas/mixed';
import { cast } from '../../src';
import { createSchemaCreator, createOptionsCreator } from '../fixtures';

describe('array - transforms', () => {
  const createSchema = createSchemaCreator('array');
  const createOptions = createOptionsCreator({ array });

  it('should base transform', () => {
    const schema = createSchema();
    const options = createOptions();
    expect(() => cast(schema, '', options)).toThrowError();
    expect(cast(schema, '[]', options)).toEqual([]);
    expect(() => cast(schema, {}, options)).toThrowError();
  });

  it('should unique transform', () => {
    const type = 'unique';
    const schema = createSchema({ transforms: [{ type }] });
    const options = createOptions();
    expect(cast(schema, [1, 2, 3, 2, 3], options)).toEqual([1, 2, 3]);
  });

  it('should unique transform by path', () => {
    const type = 'unique';
    const path = 'id';
    const options = createOptions({ context: { path } });
    expect(
      cast(
        createSchema({ transforms: [{ type, path }] }),
        [
          { id: 1, a: 'a' },
          { id: 2, b: 'b' },
          { id: 3, c: 'c' },
          { id: 2, d: 'd' },
          { id: 3, e: 'e' },
        ],
        options,
      ),
    ).toEqual([
      { id: 1, a: 'a' },
      { id: 2, b: 'b' },
      { id: 3, c: 'c' },
    ]);

    // path is a ref
    expect(
      cast(
        createSchema({ transforms: [{ type, path: { ref: '$path' } }] }),
        [
          { id: 1, a: 'a' },
          { id: 2, b: 'b' },
          { id: 3, c: 'c' },
          { id: 2, d: 'd' },
          { id: 3, e: 'e' },
        ],
        options,
      ),
    ).toEqual([
      { id: 1, a: 'a' },
      { id: 2, b: 'b' },
      { id: 3, c: 'c' },
    ]);
  });

  it('should sort', () => {
    const type = 'sort';
    const path = 'id';
    const options = createOptions({ context: { path } });

    const alphaSubject = ['joe', 'jim', 'bill', 'fred'];
    const numericSubject = [10, 7, 9, 8];
    const objSubject = [
      { id: 10, a: 'a' },
      { id: 7, b: 'b' },
      { id: 9, c: 'c' },
      { id: 8, d: 'd' },
    ];

    expect(
      cast(createSchema({ transforms: [{ type }] }), numericSubject, options),
    ).toEqual([...numericSubject].sort((a, b) => a - b));

    expect(
      cast(
        createSchema({ transforms: [{ type, dir: 'desc' }] }),
        numericSubject,
        options,
      ),
    ).toEqual([...numericSubject].sort((a, b) => b - a));

    expect(
      cast(createSchema({ transforms: [{ type }] }), alphaSubject, options),
    ).toEqual([...alphaSubject].sort());

    expect(
      cast(
        createSchema({ transforms: [{ type, dir: 'desc' }] }),
        alphaSubject,
        options,
      ),
    ).toEqual([...alphaSubject].sort().reverse());

    // object
    expect(
      cast(createSchema({ transforms: [{ type, path }] }), objSubject, options),
    ).toEqual(objSubject.sort((a, b) => a.id - b.id));

    expect(
      cast(
        createSchema({
          transforms: [{ type, path: { ref: '$path' }, dir: 'desc' }],
        }),
        objSubject,
        options,
      ),
    ).toEqual(objSubject.sort((a, b) => b.id - a.id));
  });

  it('should filter using only by value', () => {
    const type = 'only';
    const options = createOptions({ context: { vs: [1, 2, 3], a: 1, c: 3 } });
    const val = [2, 3, 4, 5, 6];
    const expected = [2, 3];
    expect(
      cast(
        createSchema({ transforms: [{ type, values: [1, 2, 3] }] }),
        val,
        options,
      ),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({ transforms: [{ type, values: { ref: '$vs' } }] }),
        val,
        options,
      ),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({
          transforms: [{ type, values: [{ ref: '$a' }, 2, { ref: '$c' }] }],
        }),
        val,
        options,
      ),
    ).toEqual(expected);
  });

  it('should filter using only by value and path', () => {
    const type = 'only';
    const path = 'id';
    const options = createOptions({
      context: { vs: [1, 2, 3], a: 1, c: 3, path },
    });
    const value = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];

    expect(
      cast(
        createSchema({ transforms: [{ type, values: [1, 2, 3], path }] }),
        value,
        options,
      ),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({
          transforms: [
            {
              type,
              values: [{ ref: '$a' }, 2, { ref: '$c' }],
              path: { ref: '$path' },
            },
          ],
        }),
        value,
        options,
      ),
    ).toEqual(expected);
  });

  it('should filter using only by schema', () => {
    const type = 'only';
    const value = [1, 2, 3, 4, 5, 6];
    const expected = [1, 2, 3];
    const where = {
      type: 'mixed',
      tests: [{ type: 'oneOf', values: [1, 2, 3] }],
    };
    const options = createOptions({
      schemas: { mixed },
      context: { vs: [1, 2, 3], a: 1, c: 3, where },
    });

    expect(
      cast(createSchema({ transforms: [{ type, where }] }), value, options),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({ transforms: [{ type, where: { ref: '$where' } }] }),
        value,
        options,
      ),
    ).toEqual(expected);
  });

  it('should filter using only by schema and path', () => {
    const type = 'only';
    const path = 'id';
    const value = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
    const expected = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const where = {
      type: 'mixed',
      tests: [{ type: 'oneOf', values: [1, 2, 3] }],
    };
    const options = createOptions({
      schemas: { mixed },
      context: { vs: [1, 2, 3], a: 1, c: 3, where, path },
    });

    expect(
      cast(
        createSchema({ transforms: [{ type, where, path }] }),
        value,
        options,
      ),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({
          transforms: [
            { type, where: { ref: '$where' }, path: { ref: '$path' } },
          ],
        }),
        value,
        options,
      ),
    ).toEqual(expected);
  });

  it('should filter using except by value', () => {
    const type = 'except';
    const value = [2, 3, 4, 5, 6];
    const expected = [4, 5, 6];
    const options = createOptions({ context: { vs: [1, 2, 3], a: 1, c: 3 } });
    expect(
      cast(
        createSchema({ transforms: [{ type, values: [1, 2, 3] }] }),
        value,
        options,
      ),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({ transforms: [{ type, values: { ref: '$vs' } }] }),
        value,
        options,
      ),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({
          transforms: [{ type, values: [{ ref: '$a' }, 2, { ref: '$c' }] }],
        }),
        value,
        options,
      ),
    ).toEqual(expected);
  });

  it('should filter using except by schema', () => {
    const type = 'except';
    const value = [2, 3, 4, 5, 6];
    const expected = [4, 5, 6];
    const where = {
      type: 'mixed',
      tests: [{ type: 'oneOf', values: [1, 2, 3] }],
    };
    const options = createOptions({
      schemas: { mixed },
      context: { vs: [1, 2, 3], a: 1, c: 3, where },
    });

    expect(
      cast(createSchema({ transforms: [{ type, where }] }), value, options),
    ).toEqual(expected);

    expect(
      cast(
        createSchema({ transforms: [{ type, where: { ref: '$where' } }] }),
        value,
        options,
      ),
    ).toEqual(expected);
  });
});
