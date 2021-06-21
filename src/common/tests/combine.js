import { createValidator, isThenable } from '../../utils';

// combiner - error message must be specified by user
export default createValidator(
  (testsWithArgs, error) => (_, { runTest }, passError) => {
    const results = testsWithArgs.map(([name, ...args]) =>
      runTest(name, ...args),
    );

    const done = (r) => r.some((e) => e !== true) || passError(error);

    return results.some(isThenable)
      ? Promise.all(results).then(done)
      : done(results)
          .then((r) => r.some((e) => e !== true))
          .then((o) => o || passError(error));
  },
);
