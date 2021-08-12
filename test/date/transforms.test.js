import { Date as SDate } from 'sugar-date';
import createDateSchema from '../../src/schemas/date';
import { cast } from '../../src';
import { createSchemaCreator, createOptionsCreator } from '../fixtures';

describe('date - tests', () => {
  const createSchema = createSchemaCreator('date');
  const parser = SDate.create;
  const createOptions = createOptionsCreator({
    date: createDateSchema({ parser }),
  });

  it('should base transform', async () => {
    const schema = createSchema();
    const options = createOptions();
    const str = 'last Tuesday';
    expect(cast(schema, str, options)).toEqual(parser(str));
  });

  it('should transform according to tersity', async () => {
    const tersity = 'month';
    const schema = createSchema({
      transforms: [{ type: 'tersity', value: tersity }],
    });
    const options = createOptions();
    const str = 'ten years ago';
    const then = new Date().getUTCFullYear() - 10;
    const result = cast(schema, str, options);
    expect(result.getUTCFullYear()).toEqual(then);
    expect(result.getUTCMonth()).toEqual(new Date().getMonth());
    expect(result.getUTCDate()).toEqual(1); // tersity stops at month
  });
});
