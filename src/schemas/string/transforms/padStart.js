export default ({ targetLength, padString }) =>
  (v) =>
    v.padStart(targetLength, padString);
