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
        await getErrorsAsync(
          createSchema({ nullable: true }),
          '',
          createOptions(),
        ),
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
});
