import { isThenable } from '../../../utils';

export default ({ tests }) => (_, { runTest }) => {
  const results = tests.map(({ name, ...args }) => runTest(name, ...args));
  const done = (r) => r.some((e) => e !== true);
  return results.some(isThenable)
    ? Promise.all(results).then(done)
    : done(results);
};
