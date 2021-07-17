import string from '../../src/schemas/string';
import { validate, cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('string - transforms', () => {
  const schemas = { string };
  const createSchema = createSchemaCreator('string');
  it('should validate', async () => {
    await expect(validate({}, 'fred', { schemas })).resolves.toBe('fred');
  });

  it('should cast using mask', async () => {
    const options = { schemas };

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
    const options = { schemas };
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
});
