import merge from './merge';

const resolveCondition = ({ when, then, otherwise }, resolver, options) =>
  ((Array.isArray(when) ? when : [when]).some((inner) =>
    Object.entries(inner).every(([ref, schema]) =>
      options.is(schema, resolver({ ref }), {
        ...options,
        // right now conditions can only be run synchronously
        sync: true,
        assert: true,
        abortEarly: true,
        multiple: false,
      }),
    ),
  )
    ? then
    : otherwise) || {};

export default (schema, resolver, options) => {
  const { conditions = [], ...rest } = schema;
  // this must return the same reference if there are no conditions
  return !conditions.length
    ? schema
    : merge(
        rest,
        ...conditions.map((c) => resolveCondition(c, resolver, options)),
      );
};
