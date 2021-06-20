import { all } from '../src/index';

const { validate } = all;

describe('conditions', () => {
  const transforms = {
    make: (v) => () => v,
    concatTo: (to) => (v) => `${to}${v}`,
  };

  it('should allow matching one of multiple whens', async () => {
    const context = (context) => ({ context, transforms });

    const schema = {
      type: 'string',
      conditions: [
        {
          when: [
            { $fred: { tests: [['is', 'bill']] } },
            { $fred: { tests: [['is', 'joe']] } },
          ],
          then: { transforms: [['make', '9']] },
          otherwise: { transforms: [['make', '8']] },
        },
      ],
    };

    expect(await validate(schema, '', context({ fred: 'bill' }))).toBe('9');
    expect(await validate(schema, '', context({ fred: 'joe' }))).toBe('9');
    expect(await validate(schema, '', context({ fred: 'jim' }))).toBe('8');
  });

  it('should process multiple conditions', async () => {
    const context = (context) => ({ context, transforms });

    const schema = {
      type: 'string',
      conditions: [
        {
          when: { $fred: { tests: [['is', 'bill']] } },
          then: { transforms: [['make', '9']] },
          otherwise: { transforms: [['make', '8']] },
        },
        {
          when: { $fred: { tests: [['is', 'joe']] } },
          then: { transforms: [['concatTo', '1']] },
          otherwise: { transforms: [['concatTo', '2']] },
        },
      ],
    };

    expect(await validate(schema, '', context({ fred: 'bill' }))).toBe('29');
    expect(await validate(schema, '', context({ fred: 'joe' }))).toBe('18');
    expect(await validate(schema, '', context({ fred: 'jim' }))).toBe('28');
  });

  it('should nest conditions', async () => {
    const context = (context) => ({ context, transforms });

    const schema = {
      type: 'string',
      conditions: [
        {
          when: { $firstName: { tests: [['is', 'Barney']] } },
          then: {
            conditions: [
              {
                when: { $lastName: { tests: [['is', 'Stinson']] } },
                then: { transforms: [['concatTo', 'Is Stinson']] },
                otherwise: { transforms: [['concatTo', 'Is Not Stinson']] },
              },
              {
                when: { $lastName: { tests: [['is', 'Rubble']] } },
                then: { transforms: [['concatTo', 'Is Rubble ']] },
                otherwise: { transforms: [['concatTo', 'Is Not Rubble ']] },
              },
            ],
          },
          otherwise: {
            transforms: [['concatTo', 'Not Barney']],
          },
        },
      ],
    };

    expect(
      await validate(
        schema,
        '',
        context({ firstName: 'Barney', lastName: 'Rubble' }),
      ),
    ).toBe('Is Rubble Is Not Stinson');

    expect(
      await validate(
        schema,
        '',
        context({ firstName: 'Barney', lastName: 'Stinson' }),
      ),
    ).toBe('Is Not Rubble Is Stinson');

    expect(
      await validate(
        schema,
        '',
        context({
          firstName: 'Fred',
        }),
      ),
    ).toBe('Not Barney');
  });
});
