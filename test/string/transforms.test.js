import string from '../../src/schemas/string';
import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('string - transforms', () => {
  const createSchema = createSchemaCreator('string');
  it('should base cast', () => {
    expect(cast(createSchema(), 0)).toBe('0');
    expect(cast(createSchema(), {})).toEqual(null);
  });

  it('should cast using mask', async () => {
    // default mask
    expect(cast(createSchema({ transforms: [{ type: 'mask' }] }), 'fred')).toBe(
      '****',
    );

    // mask from start
    expect(
      cast(
        createSchema({
          transforms: [
            { type: 'mask', pattern: '[^-]', character: '*', unmasked: 2 },
          ],
        }),
        'credit-card-number',
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
      ),
    ).toBe('cr****-****-******');
  });

  it('should cast using capitalize', () => {
    expect(
      cast(
        createSchema({ transforms: [{ type: 'capitalize' }] }),
        'some string',
      ),
    ).toBe('Some string');

    expect(
      cast(
        createSchema({ transforms: [{ type: 'capitalize', all: true }] }),
        'some string',
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
        ),
      ).toBe(expected);
    });
  });

  it('should throw an error if an unexpected case is found', () => {
    expect(() =>
      cast(
        createSchema({ transforms: [{ type: 'case', value: 'fried' }] }),
        'some-string',
      ),
    ).toThrow();
  });

  it('should lowercase', () => {
    expect(
      cast(createSchema({ transforms: [{ type: 'lowercase' }] }), 'JoSePh'),
    ).toBe('joseph');
  });

  it('should uppercase', () => {
    expect(
      cast(createSchema({ transforms: [{ type: 'uppercase' }] }), 'JoSePh'),
    ).toBe('JOSEPH');
  });

  it('should padEnd', () => {
    expect(
      cast(
        createSchema({
          transforms: [{ type: 'padEnd', targetLength: 10, padString: '0' }],
        }),
        'joe',
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
      ),
    ).toBe('0000000joe');
  });

  it('should replace', () => {
    const type = 'replace';
    expect(
      cast(
        createSchema({
          transforms: [{ type, pattern: '[aeiou]', flags: 'g' }],
        }),
        'joe',
      ),
    ).toBe('j');

    expect(
      cast(
        createSchema({
          transforms: [
            { type, pattern: '[aeiou]', flags: 'g', substitution: 'm' },
          ],
        }),
        'joe',
      ),
    ).toBe('jmm');
  });

  it('should slice', () => {
    const type = 'slice';
    expect(
      cast(createSchema({ transforms: [{ type, start: 1 }] }), 'joe'),
    ).toBe('oe');

    expect(cast(createSchema({ transforms: [{ type, end: 1 }] }), 'joe')).toBe(
      'j',
    );
  });

  it('should trim', () => {
    const type = 'trim';

    expect(cast(createSchema({ transforms: [{ type }] }), ' string ')).toBe(
      'string',
    );

    expect(
      cast(createSchema({ transforms: [{ type, start: false }] }), ' string '),
    ).toBe(' string');

    expect(
      cast(createSchema({ transforms: [{ type, end: false }] }), ' string '),
    ).toBe('string ');
  });

  it('should strip', () => {
    const type = 'strip';
    expect(
      cast(createSchema({ transforms: [{ type }] }), ' this is a long string '),
    ).toBe('thisisalongstring');
  });
});
