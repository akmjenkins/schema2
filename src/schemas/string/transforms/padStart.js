export default ({ targetLength, padString }) =>
  (v) =>
    v.padEnd(targetLength, padString);
