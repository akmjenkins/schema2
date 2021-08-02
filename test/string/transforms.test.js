import string from '../../src/schemas/string';
import { validate, cast } from '../../src';
import { createSchemaCreator, createOptionsCreator } from '../fixtures';

describe('string - transforms', () => {
  const createSchema = createSchemaCreator('string');
  const createOptions = createOptionsCreator({ string });
  it('should validate', async () => {
    await expect(validate({}, 'fred', createOptions())).resolves.toBe('fred');
  });

  it('should cast using mask', async () => {
    const options = createOptions();

    // default mask
    expect(
      cast(createSchema({ transforms: [{ type: 'mask' }] }), 'fred', options),
    ).toBe('****');

    // mask from start
    expect(
      cast(
        createSchema({
          transforms: [
            { type: 'mask', pattern: '[^-]', character: '*', unmasked: 2 },
          ],
        }),
        'credit-card-number',
        options,
      ),
    ).toBe('******-****-****er');

    // mask from end
    expect(
      cast(
        createSchema({
          transforms: [
            {
              type: 'mask',
              pattern: '[^-]',
              character: '*',
              unmasked: 2,
              start: false,
            },
          ],
        }),
        'credit-card-number',
        options,
      ),
    ).toBe('cr****-****-******');
  });

  it('should cast using capitalize', () => {
    const options = createOptions();
    expect(
      cast(
        createSchema({ transforms: [{ type: 'capitalize' }] }),
        'some string',
        options,
      ),
    ).toBe('Some string');

    expect(
      cast(
        createSchema({ transforms: [{ type: 'capitalize', all: true }] }),
        'some string',
        options,
      ),
    ).toBe('Some String');

    expect(
      cast(
        createSchema({
          transforms: [
            {
              type: 'capitalize',
              only: { tests: [{ type: 'not', value: 'some' }] },
            },
          ],
        }),
        'some string',
        options,
      ),
    ).toBe('some String');

    expect(
      cast(
        createSchema({
          transforms: [
            {
              type: 'capitalize',
              except: { tests: [{ type: 'is', value: 'some' }] },
            },
          ],
        }),
        'some string',
        options,
      ),
    ).toBe('some String');
  });

  [
    { type: 'pascal', value: 'some string', expected: 'SomeString' },
    { type: 'kebab', value: 'some string', expected: 'some-string' },
    { type: 'snake', value: 'some string', expected: 'some_string' },
    { type: 'camel', value: 'some string', expected: 'someString' },
  ].forEach(({ type, value, expected }) => {
    it(`should transform to ${type} case`, () => {
      expect(
        cast(
          createSchema({ transforms: [{ type: 'case', value: type }] }),
          value,
          createOptions(),
        ),
      ).toBe(expected);
    });
  });

  it('should throw an error if an unexpected case is found', () => {
    expect(() =>
      cast(
        createSchema({ transforms: [{ type: 'case', value: 'fried' }] }),
        'some-string',
        createOptions(),
      ),
    ).toThrow();
  });

  it('should lowercase', () => {
    expect(
      cast(
        createSchema({ transforms: [{ type: 'lowercase' }] }),
        'JoSePh',
        createOptions(),
      ),
    ).toBe('joseph');
  });

  it('should uppercase', () => {
    expect(
      cast(
        createSchema({ transforms: [{ type: 'uppercase' }] }),
        'JoSePh',
        createOptions(),
      ),
    ).toBe('JOSEPH');
  });

  it('should padEnd', () => {
    expect(
      cast(
        createSchema({
          transforms: [{ type: 'padEnd', targetLength: 10, padString: '0' }],
        }),
        'joe',
        createOptions(),
      ),
    ).toBe('joe0000000');
  });

  it('should padStart', () => {
    expect(
      cast(
        createSchema({
          transforms: [{ type: 'padStart', targetLength: 10, padString: '0' }],
        }),
        'joe',
        createOptions(),
      ),
    ).toBe('0000000joe');
  });
});
