export default ({ nearest, how }) => {
  let method = Math.round;
  if (how === 'up') method = Math.ceil;
  if (how === 'down') method = Math.floor;
  return (value) => method(value / nearest) * nearest;
};
