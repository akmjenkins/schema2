import merge from './merge';

const resolveCondition = ({ when, then, otherwise }, resolver, options) => {
  if (!then && !otherwise)
    throw new Error('One of then or otherwise must be defined');

  const { is } = options;
  // conditions must always be an array
  const whens = Array.isArray(when) ? when : [when];
  const opts = {
    ...options,
    // right now conditions can only be run synchronously
    sync: true,
    assert: true,
    abortEarly: true,
    multiple: false,
  };

  return (
    whens.some((inner) =>
      Object.entries(inner).every(([ref, schema]) =>
        is(schema, resolver({ ref }), opts),
      )
        ? then
        : otherwise,
    ) ?? {}
  );
};

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
