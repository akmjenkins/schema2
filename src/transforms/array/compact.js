// rejector is a schema definition
// if the value matches the schema definition, it is rejected

export default (rejector) => (value, _, { is }) =>
  value.filter((v) => (rejector ? !is(rejector, v) : !!v));
