import { validate } from '../../src';
import {
  createSchemaCreator,
  getErrorsAsync,
  getErrorsAtPath,
} from '../fixtures';

describe('array - tests', () => {
  const createSchema = createSchemaCreator('array');

  it('should typeCheck', async () => {
    const type = 'typeCheck';
    expect(
      getErrorsAtPath(await getErrorsAsync(createSchema(), '')),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test required', async () => {
    const type = 'required';
    const schema = createSchema({ tests: [{ type }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, []));
    expect(errors).toContainEqual(expect.objectContaining({ type }));

    await expect(validate(schema, [1])).resolves.toEqual([1]);
  });

  it('should test unique', async () => {
    const type = 'unique';
    const schema = createSchema({ tests: [{ type }] });
    await expect(validate(schema, [])).resolves.toEqual([]);
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 1])),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test unique (with path)', async () => {
    const type = 'unique';
    const path = 'id';
    const options = { context: { path } };
    const pass = [{ id: 1 }, { id: 2 }];
    const fail = [{ id: 1 }, { id: 1 }];
    await expect(
      validate(createSchema({ tests: [{ type, path }] }), pass),
    ).resolves.toEqual(pass);
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, path: { ref: '$path' } }] }),
          fail,
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test length', async () => {
    const type = 'length';
    const schema = createSchema({
      tests: [{ type, value: 2 }],
    });

    await expect(validate(schema, [1, 2])).resolves.toEqual([1, 2]);
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 2, 3])),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test min', async () => {
    const type = 'min';
    expect(
      getErrorsAtPath(
        await getErrorsAsync(createSchema({ tests: [{ type, value: 2 }] }), [
          1,
        ]),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(createSchema({ tests: [{ type, value: 2 }] }), [1, 2]),
    ).resolves.toEqual([1, 2]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
          [1, 2],
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
        [1, 2, 3],
      ),
    ).resolves.toEqual([1, 2, 3]);
  });

  it('should test min with schema', async () => {
    const type = 'min';

    const where = { type: 'mixed', tests: [{ type: 'is', value: 1 }] };
    const schema = createSchema({ tests: [{ type, value: 2, where }] });

    await expect(validate(schema, [1, 1, 1])).resolves.toEqual([1, 1, 1]);

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 2, 2])),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test min with schema and path', async () => {
    const type = 'min';

    const path = 'num';
    const where = { type: 'mixed', tests: [{ type: 'is', value: 1 }] };
    const schema = createSchema({ tests: [{ type, value: 2, where, path }] });

    await expect(
      validate(schema, [{ num: 1 }, { num: 1 }, { num: 1 }]),
    ).resolves.toEqual([{ num: 1 }, { num: 1 }, { num: 1 }]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(schema, [{ num: 1 }, { num: 2 }, { num: 2 }]),
      ),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test max', async () => {
    const type = 'max';
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2 }] }),
          [1, 2, 3],
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(createSchema({ tests: [{ type, value: 2 }] }), [1, 2]),
    ).resolves.toEqual([1, 2]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
          [1, 2],
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
        [1],
      ),
    ).resolves.toEqual([1]);
  });

  it('should test max with schema', async () => {
    const type = 'max';

    const where = { type: 'mixed', tests: [{ type: 'is', value: 1 }] };
    const schema = createSchema({ tests: [{ type, value: 2, where }] });

    await expect(validate(schema, [1, 2, 2])).resolves.toEqual([1, 2, 2]);

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 1, 1])),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test max with schema and path', async () => {
    const type = 'max';

    const path = 'num';
    const where = { type: 'mixed', tests: [{ type: 'is', value: 1 }] };
    const schema = createSchema({ tests: [{ type, value: 2, where, path }] });

    await expect(
      validate(schema, [{ num: 1 }, { num: 2 }, { num: 2 }]),
    ).resolves.toEqual([{ num: 1 }, { num: 2 }, { num: 2 }]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(schema, [{ num: 1 }, { num: 1 }, { num: 1 }]),
      ),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test between', async () => {
    const type = 'between';
    const min = 2;
    const max = 4;
    expect(
      getErrorsAtPath(
        await getErrorsAsync(createSchema({ tests: [{ type, min, max }] }), [
          1,
        ]),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(createSchema({ tests: [{ type, min, max }] }), [1, 2, 3]),
    ).resolves.toEqual([1, 2, 3]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, min, max, inclusive: false }] }),
          [1, 2],
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, min, max, inclusive: false }] }),
        [1, 2, 3],
      ),
    ).resolves.toEqual([1, 2, 3]);
  });

  it('should test inner (entry)', async () => {
    const type = 'oneOf';
    const schema = createSchema({
      inner: {
        type: 'mixed',
        tests: [{ type, values: [1, 2, 3] }],
      },
    });

    await expect(validate(schema, [1, 2, 1, 1, 2, 3])).resolves.toEqual([
      1, 2, 1, 1, 2, 3,
    ]);

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 2, 4]), '2'),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test inner (tuple)', async () => {
    const type = 'oneOf';
    const schema = createSchema({
      inner: [
        { type: 'mixed', tests: [{ type, values: [1, 2, 3] }] },
        { type: 'mixed', tests: [{ type, values: [4, 5, 6] }] },
      ],
    });

    await expect(validate(schema, [1, 5])).resolves.toEqual([1, 5]);

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [4, 2]), '0'),
    ).toContainEqual(expect.objectContaining({ type }));
  });
});
