import { cast } from '../src';
import string from '../src/schemas/string';
import { getErrorsAsync, getErrorsAtPath } from './fixtures';
describe('string schema', () => {
  const schemas = { string };
  const createSchema = (opts = {}) => ({ type: 'string', ...opts });

  it('should transform uppercase', () => {
    const schema = createSchema({ transforms: [{ type: 'uppercase' }] });
    const options = { schemas };
    expect(cast(schema, 'fred', options)).toBe('FRED');
  });

  it('should transform lowercase', () => {
    const schema = createSchema({ transforms: [{ type: 'lowercase' }] });
    const options = { schemas };
    expect(cast(schema, 'FRED', options)).toBe('fred');
  });

  it('should trim', () => {
    const schema = createSchema({ transforms: [{ type: 'trim' }] });
    const options = { schemas };
    expect(cast(schema, '  joe   ', options)).toBe('joe');
  });

  it('should trim (start false)', () => {
    const schema = createSchema({
      transforms: [{ type: 'trim', start: false }],
    });
    const options = { schemas };
    expect(cast(schema, '  joe', options)).toBe('  joe');
  });

  it('should trim (end false)', () => {
    const schema = createSchema({ transforms: [{ type: 'trim', end: false }] });
    const options = { schemas };
    expect(cast(schema, 'joe   ', options)).toBe('joe   ');
  });

  it('should strip', () => {
    const schema = createSchema({ transforms: [{ type: 'strip' }] });
    const options = { schemas };
    expect(cast(schema, '  this is a long string   ', options)).toBe(
      'thisisalongstring',
    );
  });

  it('should replace', () => {
    const schema = createSchema({
      transforms: [
        { type: 'replace', pattern: 'JOE', flags: 'i', substitution: 'bill' },
      ],
    });
    const options = { schemas };
    expect(cast(schema, 'joe smells really bad', options)).toBe(
      'bill smells really bad',
    );
  });
});
