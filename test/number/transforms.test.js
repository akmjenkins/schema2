import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('number - transforms', () => {
  const createSchema = createSchemaCreator('number');
  it('should base cast', () => {
    expect(cast(createSchema(), '9')).toBe(9);
    expect(() => cast(createSchema(), '')).toThrowError();
    expect(() => cast(createSchema(), 'fred')).toThrowError();
  });

  it('should cast absolute', () => {
    const type = 'absolute';
    const schema = createSchema({ transforms: [{ type }] });
    expect(cast(schema, -100)).toBe(100);
  });

  it('should round', () => {
    const type = 'round';
    const schema = createSchema({ transforms: [{ type }] });
    expect(cast(schema, -57.456)).toBe(-57);
  });

  it('should round ceil', () => {
    const type = 'round';
    const how = 'ceil';
    const schema = createSchema({ transforms: [{ type, how }] });
    expect(cast(schema, -57.456)).toBe(-57);
  });

  it('should round floor', () => {
    const type = 'round';
    const how = 'floor';
    const schema = createSchema({ transforms: [{ type, how }] });
    expect(cast(schema, -57.456)).toBe(-58);
  });

  it('should round to the nearest', () => {
    const type = 'round';
    const nearest = 5;
    const how = 'floor';
    const schema = createSchema({ transforms: [{ type, how, nearest }] });
    expect(cast(schema, -57.456)).toBe(-60);
  });
});
