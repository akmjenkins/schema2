import merge from './merge';
import is from './is';

export default (schema, resolver, options) => {
  const { conditions = [], ...rest } = schema;
  return !conditions.length
    ? schema
    : merge(
        rest,
        ...conditions.map((c) => resolveCondition(c, resolver, options)),
      );
};

const resolveCondition = ({ when, then, otherwise }, resolver, options) => {
  if (!then && !otherwise) {
    throw new Error('One of then or otherwise must be defined');
  }

  return (
    ((Array.isArray(when) ? when : [when]).some((inner) => {
      return is(
        { type: 'object', inner },
        Object.keys(inner).reduce(
          (acc, ref) => ({ ...acc, [ref]: resolver({ ref }) }),
          {},
        ),
        {
          ...options,
          // right now conditions can only be run synchronously
          sync: true,
          assert: true,
          abortEarly: true,
          multiple: false,
          debug: (...args) => {
            if (!options.debug) return;
            options.debug(
              'Resolving conditions must be done synchronously - ',
              ...args,
            );
          },
        },
      );
    })
      ? then
      : otherwise) ?? {}
  );
};
