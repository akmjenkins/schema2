export default ({ targetLength, padString }) =>
  (v, { resolve }) =>
    v.padEnd(resolve(targetLength), resolve(padString));
