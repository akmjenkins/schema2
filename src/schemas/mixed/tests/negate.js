import { isThenable } from '../../../utils';

const not = (name) => `not${name[0].toUpperCase()}${name.substr(1)}`;

export default ({ test }) => (_, { runTest, createError }) => {
  const { type, ...args } = test;
  const done = (e) => e === true || createError({ type: not(type) });
  const result = runTest(type, ...args);
  return isThenable(result) ? result.then(done) : done(result);
};
