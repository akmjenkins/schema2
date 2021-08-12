import array from '../../src/schemas/array';
import mixed from '../../src/schemas/mixed';
import { validate } from '../../src';
import {
  createSchemaCreator,
  createOptionsCreator,
  getErrorsAsync,
  getErrorsAtPath,
} from '../fixtures';

describe('array - tests', () => {
  const createSchema = createSchemaCreator('array');
  const createOptions = createOptionsCreator({ array });

  it('should typeCheck', async () => {
    const type = 'typeCheck';
    expect(
      getErrorsAtPath(
        await getErrorsAsync(createSchema(), '', createOptions()),
      ),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test required', async () => {
    const type = 'required';
    const options = createOptions();
    const schema = createSchema({ tests: [{ type }] });
    const errors = getErrorsAtPath(await getErrorsAsync(schema, [], options));
    expect(errors).toContainEqual(expect.objectContaining({ type }));

    await expect(validate(schema, [1], options)).resolves.toEqual([1]);
  });

  it('should test unique', async () => {
    const type = 'unique';
    const options = createOptions();
    const schema = createSchema({ tests: [{ type }] });
    await expect(validate(schema, [], options)).resolves.toEqual([]);
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 1], options)),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test unique (with path)', async () => {
    const type = 'unique';
    const path = 'id';
    const options = createOptions({ context: { path } });
    const pass = [{ id: 1 }, { id: 2 }];
    const fail = [{ id: 1 }, { id: 1 }];
    await expect(
      validate(createSchema({ tests: [{ type, path }] }), pass, options),
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
    const options = createOptions();
    const schema = createSchema({
      tests: [{ type, value: 2 }],
    });

    await expect(validate(schema, [1, 2], options)).resolves.toEqual([1, 2]);
    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 2, 3], options)),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test min', async () => {
    const type = 'min';
    const options = createOptions();
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2 }] }),
          [1],
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(createSchema({ tests: [{ type, value: 2 }] }), [1, 2], options),
    ).resolves.toEqual([1, 2]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
          [1, 2],
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
        [1, 2, 3],
        options,
      ),
    ).resolves.toEqual([1, 2, 3]);
  });

  it('should test max', async () => {
    const type = 'max';
    const options = createOptions();
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2 }] }),
          [1, 2, 3],
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(createSchema({ tests: [{ type, value: 2 }] }), [1, 2], options),
    ).resolves.toEqual([1, 2]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
          [1, 2],
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, value: 2, inclusive: false }] }),
        [1],
        options,
      ),
    ).resolves.toEqual([1]);
  });

  it('should test between', async () => {
    const type = 'between';
    const min = 2;
    const max = 4;
    const options = createOptions();
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, min, max }] }),
          [1],
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, min, max }] }),
        [1, 2, 3],
        options,
      ),
    ).resolves.toEqual([1, 2, 3]);

    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, min, max, inclusive: false }] }),
          [1, 2],
          options,
        ),
      ),
    ).toContainEqual(expect.objectContaining({ type }));

    await expect(
      validate(
        createSchema({ tests: [{ type, min, max, inclusive: false }] }),
        [1, 2, 3],
        options,
      ),
    ).resolves.toEqual([1, 2, 3]);
  });

  it('should test inner (entry)', async () => {
    const options = createOptions({ schemas: { mixed } });
    const type = 'oneOf';
    const schema = createSchema({
      inner: {
        type: 'mixed',
        tests: [{ type, values: [1, 2, 3] }],
      },
    });

    await expect(
      validate(schema, [1, 2, 1, 1, 2, 3], options),
    ).resolves.toEqual([1, 2, 1, 1, 2, 3]);

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [1, 2, 4], options), '2'),
    ).toContainEqual(expect.objectContaining({ type }));
  });

  it('should test inner (tuple)', async () => {
    const options = createOptions({ schemas: { mixed } });
    const type = 'oneOf';
    const schema = createSchema({
      inner: [
        { type: 'mixed', tests: [{ type, values: [1, 2, 3] }] },
        { type: 'mixed', tests: [{ type, values: [4, 5, 6] }] },
      ],
    });

    await expect(validate(schema, [1, 5], options)).resolves.toEqual([1, 5]);

    expect(
      getErrorsAtPath(await getErrorsAsync(schema, [4, 2], options), '0'),
    ).toContainEqual(expect.objectContaining({ type }));
  });
});
