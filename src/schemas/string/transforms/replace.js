export default ({ pattern, flags, substitution }) =>
  (v) =>
    v.replace(pattern, flags, substitution);
