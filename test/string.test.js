import string from '../src/schemas/string';
import { getErrorsAsync, getErrorsAtPath } from './fixtures';
describe('string schema', () => {
  const schemas = { string };

  it('should work', async () => {
    const errors = getErrorsAtPath(
      await getErrorsAsync({ type: 'string' }, null, { schemas }),
    );

    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual(expect.objectContaining({ type: 'notNullable' }));
  });
});
