export default ({ nearest = 1, how = 'round' }) => {
  return (value, { resolve }) => {
    const resolved = { nearest: resolve(nearest), how: resolve(how) };
    const method = Math[resolved.how];
    if (!method)
      throw new Error(
        `how must be one of 'round', 'ceil', or 'floor' - received ${how}`,
      );
    return method(value / resolved.nearest) * resolved.nearest;
  };
};
