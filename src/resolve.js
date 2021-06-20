import { get } from './get';
import parsePath from './parsePath';
import { hasOwnProp, joinPath } from './utils';

// create a root level resolver
// as long as we keep track of where we are in the tree with the path
// this resolver can always be used to resolve any schema/value

export const createResolver = (rootSchema, rootValue, options, check) => {
  // speed stuff up
  const cache = {};

  const resolver = (currentPath) => (possibleRef) => {
    if (!possibleRef) return possibleRef;
    const { ref: path } = possibleRef;
    if (!path) return possibleRef;

    const { contextPrefix, context } = options;

    const isContext = path[0] === contextPrefix;
    // get the value from context, whatever it is
    // this is a good way to include schemas for reuse:

    /**
     * {
     *    type: 'object',
     *    inner: {
     *        someKey: {ref: '$schemas.schemaA'}
     *    }
     * },
     * someValue,
     * {
     *  context: {
     *   schemas: {
     *     schemaA: ...someSchemaDefinition
     *     schemaB: ...someSchemaDefinition
     *   }
     *  }
     * }
     *
     */
    if (isContext) return get(context, path.slice(1));

    const [valuePath, schemaPath] = parsePath(path, currentPath);
    // if this value has already been retrieved
    if (hasOwnProp(cache, valuePath)) return cache[valuePath];

    const resolvedValue = get(rootValue, joinPath(valuePath));
    const resolvedSchema = get(rootSchema, joinPath(schemaPath));

    return (cache[valuePath] = !resolvedSchema
      ? resolvedValue
      : check(resolvedSchema, resolvedValue, {
          ...options,
          path: valuePath,
          resolver,
          assert: false,
        }));
  };

  return resolver;
};
