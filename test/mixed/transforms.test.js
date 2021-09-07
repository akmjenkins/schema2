import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('mixed - transforms', () => {
  const createSchema = createSchemaCreator('mixed');

  it('should cast using const', async () => {
    expect(cast(createSchema(), undefined)).toBeUndefined();
    expect(cast(createSchema(), null)).toBeNull();
    const schema = createSchema({
      transforms: [{ type: 'const', value: 'fred' }],
    });
    expect(cast(schema, 'joe')).toBe('fred');
  });

  it('should cast using default', () => {
    // undefined should default
    const schema = createSchema({
      transforms: [{ type: 'default', value: 'joe' }],
    });
    expect(cast(schema, undefined)).toBe('joe');

    // null should not default
    expect(cast(schema, null)).toBeNull();

    // a value should not default
    expect(cast(schema, 'fred')).toBe('fred');
  });
});
