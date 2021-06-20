import { all } from '../src/index';

const { is } = all;

describe('is', () => {
  it('should is a string', async () => {
    expect(await is({ type: 'string' })).toBe(true);
    expect(await is({ type: 'string', tests: ['required'] })).toBe(false);
  });
});
