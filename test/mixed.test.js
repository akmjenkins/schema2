import mixed from '../src/schemas/mixed';
import { validate, cast } from '../src';
import { getErrorsAsync, getErrorsAtPath } from './fixtures';

describe('mixed', () => {
  const schemas = { mixed };
  const createSchema = (opts) => ({ type: 'mixed', ...opts });
  it('should validate', async () => {
    await expect(validate({}, 'fred', { schemas })).resolves.toBe('fred');
  });

  it('should cast', async () => {
    const options = { schemas };
    expect(cast({}, undefined, options)).toBeUndefined();
    expect(cast({}, null, options)).toBeNull();
    const schema = createSchema({
      transforms: [{ type: 'const', value: 'fred' }],
    });
    expect(cast(schema, 'joe', options)).toBe('fred');
  });

  it('should default', () => {
    // undefined should default
    const options = { schemas };
    const schema = createSchema({
      transforms: [{ type: 'default', value: 'joe' }],
    });
    expect(cast(schema, undefined, options)).toBe('joe');

    // null should not default
    expect(cast(schema, null, options)).toBeNull();

    // a value should not default
    expect(cast(schema, 'fred', options)).toBe('fred');
  });

  it('should validate is', async () => {
    const options = { schemas };
    const type = 'is';
    const schema = createSchema({ tests: [{ type, value: 'joe' }] });
    await expect(validate(schema, 'joe', options)).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'jim', options),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({ subject: 'jim', value: 'joe' }),
      }),
    );
  });

  it('should validate is with a context ref', async () => {
    const ref = '$a';
    const value = { ref };
    const type = 'is';
    const schema = createSchema({ tests: [{ type, value }] });
    await expect(
      validate(schema, 'joe', { schemas, context: { a: 'joe' } }),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', { schemas, context: { a: 'fred' } }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          value: { ref },
          resolved: { value: 'fred' },
        }),
      }),
    );
  });

  it('should validate isType', async () => {
    const type = 'isType';
    const isTypeSchema = createSchema({
      tests: [{ type: 'is', value: 'joe' }],
    });
    const schema = createSchema({
      // yes, this is a contrived test
      tests: [{ type, schema: isTypeSchema }],
    });

    await expect(validate(schema, 'joe', { schemas })).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'jim', { schemas }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'jim',
          schema: isTypeSchema,
        }),
      }),
    );
  });

  it('should validate isType with a contextRef', async () => {
    const type = 'isType';
    const refSchema = createSchema({ tests: [{ type: 'is', value: 'joe' }] });
    const context = { schemas: { refSchema } };
    const ref = '$schemas.refSchema';
    const schema = createSchema({ tests: [{ type, schema: { ref } }] });
    await expect(validate(schema, 'joe', { schemas, context })).resolves.toBe(
      'joe',
    );

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'jim', { schemas, context }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'jim',
          schema: { ref },
          resolved: { schema: refSchema },
        }),
      }),
    );
  });

  it('should validate not', async () => {
    const type = 'not';
    const schema = createSchema({ tests: [{ type, value: 'fred' }] });
    await expect(validate(schema, 'joe', { schemas })).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'fred', { schemas }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({ subject: 'fred', value: 'fred' }),
      }),
    );
  });

  it('should validate not with a context ref', async () => {
    const ref = '$a.b';
    const value = { ref };
    const type = 'not';
    const schema = createSchema({ tests: [{ type, value }] });
    await expect(
      validate(schema, 'joe', {
        schemas,
        context: { a: { b: 'fred' } },
      }),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', {
        schemas,
        context: { a: { b: 'joe' } },
      }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          value: { ref },
          resolved: { value: 'joe' },
        }),
      }),
    );
  });

  it('should validate notType', async () => {
    const type = 'notType';
    const notTypeSchema = createSchema({
      tests: [{ type: 'is', value: 'joe' }],
    });
    const schema = createSchema({
      // value should NOT match a schema where IS joe
      tests: [{ type, schema: notTypeSchema }],
    });
    await expect(validate(schema, 'jim', { schemas })).resolves.toBe('jim');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', { schemas }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'joe',
          schema: notTypeSchema,
        }),
      }),
    );
  });

  it('should validate notType with a context ref', async () => {
    const type = 'notType';
    const refSchema = createSchema({ tests: [{ type: 'is', value: 'joe' }] });
    const context = { schemas: { refSchema } };
    const ref = '$schemas.refSchema';
    const schema = createSchema({ tests: [{ type, schema: { ref } }] });
    await expect(validate(schema, 'jim', { schemas, context })).resolves.toBe(
      'jim',
    );

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', { schemas, context }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'joe',
          resolved: { schema: refSchema },
        }),
      }),
    );
  });

  it('should validate same', async () => {
    const ref = '$a.b';
    const type = 'same';
    const schema = createSchema({ tests: [{ type, ref }] });
    await expect(
      validate(schema, 'joe', { schemas, context: { a: { b: 'joe' } } }),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', {
        schemas,
        context: { a: { b: 'fred' } },
      }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'joe',
          ref,
          resolved: { ref: 'fred' },
        }),
      }),
    );
  });

  it('should validate different', async () => {
    const ref = '$a.b';
    const type = 'different';
    const schema = createSchema({ tests: [{ type, ref }] });
    await expect(
      validate(schema, 'joe', { schemas, context: { a: { b: 'fred' } } }),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', {
        schemas,
        context: { a: { b: 'joe' } },
      }),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'joe',
          ref,
          resolved: { ref: 'joe' },
        }),
      }),
    );
  });

  it('should validate oneOf', async () => {
    const ref = '$a.b';
    const type = 'oneOf';
    const schema = createSchema({
      tests: [{ type, values: ['1', { ref }, 'joe'] }],
    });
    // pass with value
    await expect(validate(schema, 'joe', { schemas })).resolves.toBe('joe');

    // pass with ref
    await expect(
      validate(schema, 'joe', { schemas, context: { a: { b: 'joe' } } }),
    ).resolves.toBe('joe');

    // fail
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'fred', {
        schemas,
        context: { a: { b: 'joe' } },
      }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'fred',
          values: ['1', { ref }, 'joe'],
          resolved: { values: ['1', 'joe', 'joe'] },
        }),
      }),
    );
  });
  it('should validate oneOfType', async () => {
    const ref = '$schemas.refSchema';
    const refSchema = createSchema({
      tests: [{ type: 'is', value: 'joe' }],
    });
    const inlineSchema = createSchema({
      tests: [{ type: 'is', value: { ref: '$a.b' } }],
    });
    const type = 'oneOfType';
    const schema = createSchema({
      tests: [{ type, schemas: [inlineSchema, { ref }] }],
    });

    const context = { schemas: { refSchema }, a: { b: 'jim' } };

    await expect(validate(schema, 'joe', { schemas, context })).resolves.toBe(
      'joe',
    );
    await expect(validate(schema, 'jim', { schemas, context })).resolves.toBe(
      'jim',
    );

    // fail
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'fred', { schemas, context }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'fred',
          schemas: [inlineSchema, { ref }],
          resolved: { schemas: [inlineSchema, refSchema] },
        }),
      }),
    );
  });

  it('should validate notOneOf', async () => {
    const ref = '$a.b';
    const type = 'notOneOf';
    const schema = createSchema({
      tests: [{ type, values: ['1', { ref }, 'fred'] }],
    });
    // pass with value
    await expect(validate(schema, 'joe', { schemas })).resolves.toBe('joe');

    // pass with ref
    await expect(
      validate(schema, 'joe', { schemas, context: { a: { b: 'jim' } } }),
    ).resolves.toBe('joe');

    // fail
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', {
        schemas,
        context: { a: { b: 'joe' } },
      }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'joe',
          values: ['1', { ref }, 'fred'],
          resolved: { values: ['1', 'joe', 'fred'] },
        }),
      }),
    );
  });
  it('should validate notOneOfType', async () => {
    const ref = '$schemas.refSchema';
    const refSchema = createSchema({
      tests: [{ type: 'is', value: 'joe' }],
    });
    const inlineSchema = createSchema({
      tests: [{ type: 'is', value: { ref: '$a.b' } }],
    });
    const type = 'notOneOfType';
    const schema = createSchema({
      tests: [{ type, schemas: [inlineSchema, { ref }] }],
    });

    const context = { schemas: { refSchema }, a: { b: 'jim' } };

    await expect(validate(schema, 'fred', { schemas, context })).resolves.toBe(
      'fred',
    );

    // fails by matching the inlineSchema referencing context
    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'jim', { schemas, context }),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'jim',
          schemas: [inlineSchema, { ref }],
          resolved: { schemas: [inlineSchema, refSchema] },
        }),
      }),
    );
  });
  it('should validate negate', async () => {
    const options = { schemas };
    const type = 'negate';
    const test = { type: 'is', value: 'joe' };
    const schema = createSchema({
      tests: [{ type, test }],
    });
    await expect(validate(schema, 'jim', options)).resolves.toBe('jim');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', options),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type: 'notIs',
        params: expect.objectContaining({ subject: 'joe', test }),
      }),
    );

    // validate async negate
  });
  it('should validate combine', async () => {});
  it('should validate serial', async () => {});
});
