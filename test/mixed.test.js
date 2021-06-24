import mixed from '../src/schemas/mixed';
import { validate, cast } from '../src';
import { getErrorsAsync, getErrorsAtPath } from './fixtures';

describe('mixed', () => {
  const schemas = { mixed };
  it('should validate', async () => {
    await expect(validate({}, 'fred', { schemas })).resolves.toBe('fred');
  });

  it('should cast', async () => {
    expect(cast({}, undefined, { schemas })).toBeUndefined();
    expect(cast({}, null, { schemas })).toBeNull();
    expect(
      cast({ transforms: [{ type: 'const', value: 'fred' }] }, 'joe', {
        schemas,
      }),
    ).toBe('fred');
  });

  it('should default', () => {
    // undefined should default
    expect(
      cast({ transforms: [{ type: 'default', value: 'joe' }] }, undefined, {
        schemas,
      }),
    ).toBe('joe');

    // null should not default
    expect(
      cast({ transforms: [{ type: 'default', value: 'joe' }] }, null, {
        schemas,
      }),
    ).toBeNull();

    // a value should not default
    expect(
      cast({ transforms: [{ type: 'default', value: 'joe' }] }, 'fred', {
        schemas,
      }),
    ).toBe('fred');
  });

  it('should validate is', async () => {
    await expect(
      validate({ tests: [{ type: 'is', value: 'joe' }] }, 'joe', { schemas }),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync({ tests: [{ type: 'is', value: 'fred' }] }, 'joe', {
        schemas,
      }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type: 'is',
        params: expect.objectContaining({ subject: 'joe', value: 'fred' }),
      }),
    );
  });

  it('should validate is with a context ref', async () => {
    const ref = '$a';
    const value = { ref };
    await expect(
      validate({ tests: [{ type: 'is', value }] }, 'joe', {
        schemas,
        context: { a: 'joe' },
      }),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync({ tests: [{ type: 'is', value }] }, 'joe', {
        schemas,
        context: { a: 'fred' },
      }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type: 'is',
        params: expect.objectContaining({
          value: { ref },
          resolved: { value: 'fred' },
        }),
      }),
    );
  });

  it('should validate is with a schema', async () => {
    await expect(
      validate(
        {
          tests: [
            // yes, this is a contrived test
            { type: 'is', schema: { tests: [{ type: 'is', value: 'joe' }] } },
          ],
        },
        'joe',
        { schemas },
      ),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(
        {
          tests: [
            { type: 'is', schema: { tests: [{ type: 'is', value: 'fred' }] } },
          ],
        },
        'joe',
        {
          schemas,
        },
      ),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type: 'is',
        params: expect.objectContaining({
          subject: 'joe',
          schema: { tests: [{ type: 'is', value: 'fred' }] },
        }),
      }),
    );
  });

  it('should validate not', async () => {});

  it('should validate not with a context ref', async () => {});

  it('should validate same', async () => {});
  it('should validate different', async () => {});
  it('should validate oneOf', async () => {});
  it('should validate oneOf with refs', async () => {});
  it('should validate oneOf with schemas', async () => {});
  it('should validate notOneOf', async () => {});
  it('should validate notOneOf with refs', async () => {});
  it('should validate notOneOf with schemas', async () => {});
  it('should validate negate', async () => {});
  it('should validate combine', async () => {});
  it('should validate serial', async () => {});
});
