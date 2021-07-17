import mixed from '../../src/schemas/mixed';
import { validate } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('mixed - tests', () => {
  const createSchema = createSchemaCreator('mixed');
  const createOptions = createOptionsCreator({ mixed });
  it('should validate', async () => {
    await expect(validate({}, 'fred', createOptions())).resolves.toBe('fred');
  });

  it('should resolve at notNullable error', async () => {
    const schema = createSchema();
    const options = createOptions();
    const errors = getErrorsAtPath(await getErrorsAsync(schema, null, options));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'notNullable' }));
  });

  it('should validate is', async () => {
    const options = createOptions();
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

  it('should validate is with a context ref value', async () => {
    const ref = '$a';
    const value = { ref };
    const type = 'is';
    const schema = createSchema({ tests: [{ type, value }] });
    await expect(
      validate(schema, 'joe', createOptions({ context: { a: 'joe' } })),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(
        schema,
        'joe',
        createOptions({ context: { a: 'fred' } }),
      ),
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

  it('should validate is with a schema', async () => {
    const options = createOptions();
    const type = 'is';
    const refSchema = { type: 'mixed', tests: [{ type, value: 'joe' }] };
    const schema = createSchema({ tests: [{ type, schema: refSchema }] });
    await expect(validate(schema, 'joe', options)).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'jim', options),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({ subject: 'jim', schema: refSchema }),
      }),
    );
  });

  it('should validate is with a context ref schema', async () => {
    const ref = '$a';
    const refSchema = { ref };
    const type = 'is';
    const context = { a: { type: 'mixed', tests: [{ type, value: 'joe' }] } };
    const options = createOptions({ context });
    const schema = createSchema({ tests: [{ type, schema: refSchema }] });
    await expect(validate(schema, 'joe', options)).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'jim', options),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'jim',
          schema: refSchema,
          resolved: { schema: context.a },
        }),
      }),
    );
  });

  it('should validate not', async () => {
    const options = createOptions();
    const type = 'not';
    const schema = createSchema({ tests: [{ type, value: 'fred' }] });
    await expect(validate(schema, 'joe', options)).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'fred', options),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({ subject: 'fred', value: 'fred' }),
      }),
    );
  });

  it('should validate not with a context ref value', async () => {
    const ref = '$a.b';
    const value = { ref };
    const type = 'not';
    const schema = createSchema({ tests: [{ type, value }] });
    await expect(
      validate(schema, 'joe', createOptions({ context: { a: { b: 'fred' } } })),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(
        schema,
        'joe',
        createOptions({ context: { a: { b: 'joe' } } }),
      ),
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

  it('should validate not with a schema', async () => {
    const options = createOptions();
    const type = 'not';
    const refSchema = { type: 'mixed', tests: [{ type, value: 'jim' }] };
    const schema = createSchema({ tests: [{ type, schema: refSchema }] });
    await expect(validate(schema, 'jim', options)).resolves.toBe('jim');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', options),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({ subject: 'joe', schema: refSchema }),
      }),
    );
  });

  it('should validate not with a context ref schema', async () => {
    const ref = '$a';
    const refSchema = { ref };
    const type = 'not';
    const context = { a: { type: 'mixed', tests: [{ type, value: 'jim' }] } };
    const options = createOptions({ context });
    const schema = createSchema({ tests: [{ type, schema: refSchema }] });
    await expect(validate(schema, 'jim', options)).resolves.toBe('jim');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'joe', options),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'joe',
          schema: refSchema,
          resolved: { schema: context.a },
        }),
      }),
    );
  });

  it('should validate same', async () => {
    const ref = '$a.b';
    const type = 'same';
    const schema = createSchema({ tests: [{ type, ref }] });
    await expect(
      validate(schema, 'joe', createOptions({ context: { a: { b: 'joe' } } })),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(
        schema,
        'joe',
        createOptions({ context: { a: { b: 'fred' } } }),
      ),
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
      validate(schema, 'joe', createOptions({ context: { a: { b: 'fred' } } })),
    ).resolves.toBe('joe');

    const errors = getErrorsAtPath(
      await getErrorsAsync(
        schema,
        'joe',
        createOptions({ context: { a: { b: 'joe' } } }),
      ),
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
    const schemaRef = '$c.d';
    const type = 'oneOf';
    const schemas = [
      { type: 'mixed', tests: [{ type, values: ['bill'] }] },
      { type: 'mixed', tests: [{ type, values: ['jim'] }] },
      { ref: schemaRef },
    ];

    const values = ['1', { ref }, 'joe'];

    // pass with values
    await expect(
      validate(
        createSchema({ tests: [{ type, values }] }),
        'joe',
        createOptions(),
      ),
    ).resolves.toBe('joe');

    // pass with values resolving a ref
    await expect(
      validate(
        createSchema({ tests: [{ type, values }] }),
        'joe',
        createOptions({ context: { a: { b: 'joe' } } }),
      ),
    ).resolves.toBe('joe');

    // pass with schema
    await expect(
      validate(
        createSchema({ tests: [{ type, schemas }] }),
        'bill',
        createOptions(),
      ),
    ).resolves.toBe('bill');

    // pass with schemaRef
    await expect(
      validate(
        createSchema({ tests: [{ type, schemas }] }),
        'buster',
        createOptions({
          context: {
            c: { d: { type: 'mixed', tests: [{ type, values: ['buster'] }] } },
          },
        }),
      ),
    ).resolves.toBe('buster');

    // fail
    const errors = getErrorsAtPath(
      await getErrorsAsync(
        createSchema({ tests: [{ type, schemas, values }] }),
        'fred',
        createOptions(),
      ),
    );

    expect(errors).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'fred',
          values,
          schemas,
          resolved: {
            values: ['1', undefined, 'joe'],
            schemas: [
              { type: 'mixed', tests: [{ type, values: ['bill'] }] },
              { type: 'mixed', tests: [{ type, values: ['jim'] }] },
            ],
          },
        }),
      }),
    );
  });

  it('should validate notOneOf', async () => {
    const type = 'notOneOf';
    const values = ['1', { ref: '$a.b' }, 'joe'];

    // pass with values
    expect(
      await validate(
        createSchema({ tests: [{ type, values }] }),
        'bill',
        createOptions(),
      ),
    ).toBe('bill');

    // fail with values
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, values }] }),
          '1',
          createOptions(),
        ),
      ),
    ).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: '1',
          values,
          resolved: expect.objectContaining({
            values: ['1', undefined, 'joe'],
          }),
        }),
      }),
    );

    // fail with value ref
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, values }] }),
          'fred',
          createOptions({ context: { a: { b: 'fred' } } }),
        ),
      ),
    ).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'fred',
          values,
          resolved: expect.objectContaining({
            values: ['1', 'fred', 'joe'],
          }),
        }),
      }),
    );

    const schemaRef = '$c.d';
    const schemas = [
      { type: 'mixed', tests: [{ type: 'is', value: 'bill' }] },
      { type: 'mixed', tests: [{ type: 'is', value: 'jim' }] },
      { ref: schemaRef },
    ];

    // pass with schemas
    expect(
      await validate(
        createSchema({ tests: [{ type, schemas }] }),
        'joe',
        createOptions(),
      ),
    ).toBe('joe');

    // fail with schemas
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, schemas }] }),
          'jim',
          createOptions(),
        ),
      ),
    ).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'jim',
          schemas,
          resolved: expect.objectContaining({
            schemas: schemas.slice(0, 2), // third value is an undefined ref
          }),
        }),
      }),
    );

    // fail with schemaRef
    const ref = { type: 'mixed', tests: [{ type: 'is', value: 'fred' }] };
    expect(
      getErrorsAtPath(
        await getErrorsAsync(
          createSchema({ tests: [{ type, schemas }] }),
          'fred',
          createOptions({ context: { c: { d: ref } } }),
        ),
      ),
    ).toContainEqual(
      expect.objectContaining({
        type,
        params: expect.objectContaining({
          subject: 'fred',
          schemas,
          resolved: expect.objectContaining({
            schemas: schemas.slice(0, 2).concat(ref), // third value is an undefined ref
          }),
        }),
      }),
    );
  });

  it('should validate negate', async () => {
    const options = createOptions();
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

  it('should validate combine', async () => {
    const options = createOptions();
    const type = 'combine';
    const error = { type: 'notJoeOrFred' };
    const tests = [
      {
        type: 'not',
        value: 'joe',
      },
      {
        type: 'not',
        value: 'fred',
      },
    ];
    const schema = createSchema({
      tests: [{ type, tests, error }],
    });
    await expect(validate(schema, 'jim', options)).resolves.toBe('jim');

    const errors = getErrorsAtPath(
      await getErrorsAsync(schema, 'fred', options),
    );
    expect(errors).toContainEqual(
      expect.objectContaining({
        type: error.type,
        params: expect.objectContaining({ subject: 'fred', tests }),
      }),
    );

    // should combine async
  });

  it('should validate serial', async () => {});
});
