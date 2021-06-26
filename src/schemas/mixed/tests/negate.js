import { isThenable } from '../../../utils';

const not = (name) => `not${name[0].toUpperCase()}${name.substr(1)}`;

export default ({ test }) => (_, { runTest, createError }) => {
  const done = (e) =>
    e === true ? createError({ type: not(test.type) }) : true;
  const result = runTest(test);
  return isThenable(result) ? result.then(done) : done(result);
};
