import { tests as mixedTests, transforms as mixedTransforms } from '../mixed';
import * as theseTransforms from './transforms';
import * as theseTests from './tests';
import parser from './parser';

const tests = { ...mixedTests, ...theseTests };
const transforms = { ...mixedTransforms, ...theseTransforms };

export { tests, transforms };

export default {
  tests,
  transforms,
  parser,
  base: {
    transforms: ['base'],
    tests: ['typeCheck'],
  },
};
