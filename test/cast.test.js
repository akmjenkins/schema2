import { all } from '../src/index';

const { cast } = all;

describe('cast', () => {
  it('should cast a string', async () => {
    expect(await cast({ type: 'string' })).toBeUndefined();
    expect(await cast({ type: 'string' }, [9])).toBe('9');
    expect(await cast({ type: 'string' }, ['joe', 'bill'])).toBe('joe,bill');
  });
});
