import { Date as SDate } from 'sugar-date';
import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('date - tests', () => {
  const createSchema = createSchemaCreator('date');
  const dateParser = (date) => SDate.create(date, { fromUTC: true });
  const options = { dateParser };

  it('should base transform', async () => {
    const schema = createSchema();
    const str = 'last Tuesday';
    expect(cast(schema, str, options)).toEqual(dateParser(str));
  });

  it('should transform according to tersity', async () => {
    const tersity = 'month';
    const schema = createSchema({
      transforms: [{ type: 'tersity', value: tersity }],
    });
    const str = 'ten years ago';
    const then = new Date().getUTCFullYear() - 10;
    const result = cast(schema, str, options);
    expect(result.getUTCFullYear()).toEqual(then);
    expect(result.getUTCMonth()).toEqual(new Date().getMonth());
    expect(result.getUTCDate()).toEqual(1); // tersity stops at month
  });
});
