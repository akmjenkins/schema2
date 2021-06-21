import { createValidator, isThenable } from '../../utils';

const not = (name) => `not${name[0].toUpperCase()}${name.substr(1)}`;

// general purpose negater
export default createValidator(
  ([name, ...args], error) => (_, { runTest }, passError) => {
    const done = (e) => e === true || passError(error, { name: not(name) });
    const result = runTest(name, ...args);
    return isThenable(result) ? result.then(done) : done(result);
  },
);
