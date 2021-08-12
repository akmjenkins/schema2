export default ({ nearest = 1, how }) => {
  return (value, { resolve }) => {
    const resolved = { nearest: resolve(nearest), how: resolve(how) };
    let method = Math.round;
    if (resolved.how === 'ceil') method = Math.ceil;
    if (resolved.how === 'floor') method = Math.floor;
    return method(value / resolved.nearest) * resolved.nearest;
  };
};
