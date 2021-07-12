export default ({ pattern, flags, substitution }) =>
  (v, { resolve }) =>
    v.replace(RegExp(resolve(pattern), resolve(flags)), resolve(substitution));
