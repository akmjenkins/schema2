export default (regexp, substitution) => (v) =>
  v && v.replace(regexp, substitution);
