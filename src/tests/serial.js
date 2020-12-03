// designed specifically as a proper "abortEarly" for async tests

import { createValidator } from '../utils';

// NOT DONE YET!

// combiner - error message must be specified by user
export default createValidator(
  (testsWithArgs, error) => (_, { runTest }, passError) => {
    const final = testsWithArgs.reduce(async (last, [name, ...args]) => {
      const result = await last;
      if (result !== true) return last;
      return runTest(name, ...args);
    }, Promise.resolve(true));
  },
);
