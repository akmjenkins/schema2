import boolean from '../../src/schemas/boolean';
import { cast } from '../../src';
import { createSchemaCreator, createOptionsCreator } from '../fixtures';

describe('boolean - transforms', () => {
  const createSchema = createSchemaCreator('boolean');
  const createOptions = createOptionsCreator({ boolean });
  it('should base cast', () => {
    expect(cast(createSchema(), '1', createOptions())).toBe(true);
    expect(cast(createSchema(), 'true', createOptions())).toBe(true);
    expect(cast(createSchema(), true, createOptions())).toBe(true);
    expect(cast(createSchema(), '0', createOptions())).toBe(false);
    expect(cast(createSchema(), 'false', createOptions())).toBe(false);
    expect(cast(createSchema(), false, createOptions())).toBe(false);
  });
});
