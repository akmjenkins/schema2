export default () => (val) =>
  val instanceof Boolean || typeof val === 'boolean';
