export default ({ targetLength, padString }) =>
  (v, { resolve }) =>
    v.padStart(resolve(targetLength), resolve(padString));
