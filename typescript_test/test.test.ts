import { is, Schema } from '../src';

describe('typescript', () => {
  it('should work', async () => {
    const schema: Schema = {
      type: 'string',
      tests: [
        {
          type: 'required',
        },
        {
          type: 'matches',
          pattern: '',
        },
      ],
      transforms: [
        {
          type: 'capitalize',
          except: /test/,
        },
      ],
    };

    const f = is(schema, '{}', { sync: true });

    expect(f).toBe(true);
  });
});
