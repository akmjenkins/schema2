import { makeParams } from '../../utils';
export default ({ pattern, flags }) =>
  (value, { createError, resolve }) => {
    const resolved = { regexp: resolve(pattern), flags: resolve(flags) };
    return (
      new RegExp(resolved.pattern, resolved.flags).test(value) ||
      createError(makeParams({ resolved }))
    );
  };
