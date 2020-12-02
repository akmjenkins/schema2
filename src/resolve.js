import { get } from '@zuze/interpolate';
import parsePath from './parsePath';
import { joinPath } from './utils';

// create a root level resolver
// as long as we keep track of where we are in the tree with the path
// this resolver can always be used to resolve any schema/value, regardless of where we are in the tree
// extra: pass check in for dependency inversion
export const createResolver = (rootSchema, rootValue, options, check) => {
  // speed stuff up
  const cache = {};

  const resolver = (currentPath) => (possibleRef) => {
    if (!possibleRef) return possibleRef;
    const { ref: path } = possibleRef;
    if (!path) return possibleRef;

    const { contextPrefix, context } = options;

    const isContext = path[0] === contextPrefix;
    if (isContext) return get(context, path.slice(1));

    const [valuePath, schemaPath] = parsePath(path, currentPath);
    // if this value has already been retrieved
    if (Object.prototype.hasOwnProperty.call(cache, valuePath))
      return cache[valuePath];

    const resolvedSchema = get(rootSchema, joinPath(schemaPath));
    const resolvedValue = get(rootValue, joinPath(valuePath));

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
