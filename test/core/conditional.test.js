import { cast } from '../../src';
import { createSchemaCreator } from '../fixtures';

describe('core - conditional', () => {
  const createSchema = createSchemaCreator('mixed');

  it.only('should resolve conditions', () => {
    const schema = createSchema({
      conditions: [
        {
          when: {
            $a: {
              type: 'mixed',
              tests: [{ type: 'is', value: 'a' }],
            },
          },
          then: { transforms: [{ type: 'const', value: { ref: '$to.then' } }] },
          otherwise: {
            transforms: [{ type: 'const', value: { ref: '$to.otherwise' } }],
          },
        },
      ],
    });

    const context = { to: { then: 'f', otherwise: 'g' } };

    expect(cast(schema, null, { context })).toEqual(context.to.otherwise);
    expect(cast(schema, null, { context: { ...context, a: 'a' } })).toEqual(
      context.to.then,
    );
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

    expect(cast(schema, null, { context })).toEqual(context.to.otherwise);
    expect(cast(schema, null, { context: { ...context, a: 'a' } })).toEqual(
      context.to.then,
    );
    expect(cast(schema, null, { context: { ...context, b: 'a' } })).toEqual(
      context.to.then,
    );
  });
});
