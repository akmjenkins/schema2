import mixed from '../../src/schemas/mixed';
import { cast } from '../../src';
import {
  getErrorsAsync,
  getErrorsAtPath,
  createSchemaCreator,
  createOptionsCreator,
} from '../fixtures';

describe('core - conditional', () => {
  const createSchema = createSchemaCreator('mixed');
  const createOptions = createOptionsCreator({ mixed });

  it('should resolve conditions', () => {
    const schema = createSchema({
      conditions: [
        {
          when: { $a: { type: 'mixed', tests: [{ type: 'is', value: 'a' }] } },
          then: { transforms: [{ type: 'const', value: { ref: '$to.then' } }] },
          otherwise: {
            transforms: [{ type: 'const', value: { ref: '$to.otherwise' } }],
          },
        },
      ],
    });

    const context = { to: { then: 'f', otherwise: 'g' } };

    expect(cast(schema, null, createOptions({ context }))).toEqual(
      context.to.otherwise,
    );
    expect(
      cast(schema, null, createOptions({ context: { ...context, a: 'a' } })),
    ).toEqual(context.to.then);
  });

  it('should resolve conditions (where when is an array)', () => {
    const schema = createSchema({
      conditions: [
        {
          when: [
            { $a: { type: 'mixed', tests: [{ type: 'is', value: 'a' }] } },
            { $b: { type: 'mixed', tests: [{ type: 'is', value: 'a' }] } },
          ],
          then: { transforms: [{ type: 'const', value: { ref: '$to.then' } }] },
          otherwise: {
            transforms: [{ type: 'const', value: { ref: '$to.otherwise' } }],
          },
        },
      ],
    });

    const context = { to: { then: 'f', otherwise: 'g' } };

    expect(cast(schema, null, createOptions({ context }))).toEqual(
      context.to.otherwise,
    );
    expect(
      cast(schema, null, createOptions({ context: { ...context, a: 'a' } })),
    ).toEqual(context.to.then);
    expect(
      cast(schema, null, createOptions({ context: { ...context, b: 'a' } })),
    ).toEqual(context.to.then);
  });
});
