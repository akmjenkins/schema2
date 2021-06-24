export default () => (val) =>
  val instanceof Number || (typeof val === 'number' && !isNaN(val));
