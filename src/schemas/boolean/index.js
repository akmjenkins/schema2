import { tests as mixedTests, transforms as mixedTransforms } from '../mixed';
import * as theseTransforms from './transforms';
import * as theseTests from './tests';

const tests = { ...mixedTests, ...theseTests };
const transforms = { ...mixedTransforms, ...theseTransforms };

export { tests, transforms };

export default {
  tests,
  transforms,
  base: {
    transforms: ['base'],
    tests: ['typeCheck'],
  },
};
