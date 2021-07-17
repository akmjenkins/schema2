import { isThenable } from '../../../utils';
import { capitalize } from '../../utils';

export default ({ test }) =>
  (_, { runTest, createError }) => {
    const done = (e) =>
      e !== true || createError({ type: `not${capitalize(test.type)}` });
    const result = runTest(test);
    return isThenable(result) ? result.then(done) : done(result);
  };
