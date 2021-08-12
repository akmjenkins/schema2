import { isThenable } from '../../../utils';

const done = (r) => r.every((e) => e === true);

export default ({ tests }) =>
  (_, { runTest }) => {
    const results = tests.map(runTest);
    return results.some(isThenable)
      ? Promise.all(results).then(done)
      : done(results);
  };
