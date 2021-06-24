import { isThenable } from '../../../utils';

// combiner - error message must be specified by user
export default ({ tests }) => (_, { runTest }) => {
  const results = tests.map(({ name, ...args }) => runTest(name, ...args));

  const done = (r) => r.some((e) => e !== true);

  return results.some(isThenable)
    ? Promise.all(results).then(done)
    : done(results).then((r) => r.some((e) => e !== true));
};
