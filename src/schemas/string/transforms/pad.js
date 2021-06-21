export default (how, length, padder) => (v) => {
  if (how === 'start') {
    return v.padStart(length, padder);
  }
  if (how === 'end') {
    return v.padEnd(length, padder);
  }

  throw new Error(
    `First argument to pad must be start or end - received ${how}`,
  );
};
