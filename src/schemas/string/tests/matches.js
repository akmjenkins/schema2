import { makeParams } from '../../utils';
export default ({ pattern, flags }) =>
  (value, { createError, resolve }) => {
    const resolved = { pattern: resolve(pattern), flags: resolve(flags) };
    return (
      RegExp(resolved.pattern, resolved.flags).test(value) ||
      createError(makeParams({ resolved }))
    );
  };
