import mixed from '../../src/schemas/mixed';
import { cast } from '../../src';
import { createOptionsCreator, createSchemaCreator } from '../fixtures';

describe('mixed - transforms', () => {
  const createOptions = createOptionsCreator({ mixed });
  const createSchema = createSchemaCreator('mixed');

  it('should cast using const', async () => {
    const options = createOptions();
    expect(cast(createSchema(), undefined, options)).toBeUndefined();
    expect(cast(createSchema(), null, options)).toBeNull();
    const schema = createSchema({
      transforms: [{ type: 'const', value: 'fred' }],
    });
    expect(cast(schema, 'joe', options)).toBe('fred');
  });

  it('should cast using default', () => {
    // undefined should default
    const options = createOptions();
    const schema = createSchema({
      transforms: [{ type: 'default', value: 'joe' }],
    });
    expect(cast(schema, undefined, options)).toBe('joe');

    // null should not default
    expect(cast(schema, null, options)).toBeNull();

    // a value should not default
    expect(cast(schema, 'fred', options)).toBe('fred');
  });
});
