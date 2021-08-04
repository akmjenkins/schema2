import array from '../../src/schemas/array';
import { cast } from '../../src';
import { createSchemaCreator, createOptionsCreator } from '../fixtures';

describe('array - transforms', () => {
  const createSchema = createSchemaCreator('array');
  const createOptions = createOptionsCreator({ array });

  it('should base transform', () => {
    const schema = createSchema();
    const options = createOptions();
    expect(cast(schema, '', options)).toBeNull();
    expect(cast(schema, '[]', options)).toEqual([]);
    expect(cast(schema, {}, options)).toBeNull();
  });

  it('should unique transform', () => {
    const type = 'unique';
    const schema = createSchema({ transforms: [{ type }] });
    const options = createOptions();
    expect(cast(schema, [1, 2, 3, 2, 3], options)).toEqual([1, 2, 3]);
  });

  it('should unique transform by path', () => {
    const type = 'unique';
    const schema = createSchema({ transforms: [{ type, path: 'id' }] });
    const options = createOptions();
    expect(
      cast(
        schema,
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
    const options = createOptions();

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
    ).toEqual(numericSubject.sort());

    expect(
      cast(
        createSchema({ transforms: [{ type, dir: 'desc' }] }),
        numericSubject,
        options,
      ),
    ).toEqual(numericSubject.sort().reverse());

    expect(
      cast(createSchema({ transforms: [{ type }] }), alphaSubject, options),
    ).toEqual(alphaSubject.sort());

    expect(
      cast(
        createSchema({ transforms: [{ type, dir: 'desc' }] }),
        alphaSubject,
        options,
      ),
    ).toEqual(alphaSubject.sort().reverse());
  });
});
