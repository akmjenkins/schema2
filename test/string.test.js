import { cast } from '../src';
import string from '../src/schemas/string';
import { getErrorsAsync, getErrorsAtPath } from './fixtures';
describe('string schema', () => {
  const schemas = { string };
  const createSchema = (opts = {}) => ({ type: 'string', ...opts });

  it('should transform uppercase', async () => {
    const schema = createSchema({ transforms: [{ type: 'uppercase' }] });
    const options = { schemas };
    expect(cast(schema, 'fred', options)).toBe('FRED');
  });

  it('should transform lowercase', async () => {
    const schema = createSchema({ transforms: [{ type: 'lowercase' }] });
    const options = { schemas };
    expect(cast(schema, 'FRED', options)).toBe('fred');
  });

  it('should trim', async () => {
    const schema = createSchema({ transforms: [{ type: 'trim' }] });
    const options = { schemas };
    expect(cast(schema, '  joe   ', options)).toBe('joe');
  });

  it('should trim (start false)', async () => {
    const schema = createSchema({
      transforms: [{ type: 'trim', start: false }],
    });
    const options = { schemas };
    expect(cast(schema, '  joe', options)).toBe('  joe');
  });

  it('should trim (end false)', async () => {
    const schema = createSchema({
      transforms: [{ type: 'trim', end: false }],
    });
    const options = { schemas };
    expect(cast(schema, 'joe   ', options)).toBe('joe   ');
  });

  it('should strip', async () => {
    const schema = createSchema({ transforms: [{ type: 'strip' }] });
    const options = { schemas };
    expect(cast(schema, '  this is a long string   ', options)).toBe(
      'thisisalongstring',
    );
  });
});
