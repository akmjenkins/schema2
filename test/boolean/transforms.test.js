import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('boolean - transforms', () => {
  const createSchema = createSchemaCreator('boolean');
  it('should base cast', () => {
    expect(cast(createSchema(), '1')).toBe(true);
    expect(cast(createSchema(), 'true')).toBe(true);
    expect(cast(createSchema(), true)).toBe(true);
    expect(cast(createSchema(), '0')).toBe(false);
    expect(cast(createSchema(), 'false')).toBe(false);
    expect(cast(createSchema(), false)).toBe(false);
  });
});
