import * as transforms from './transforms';
import * as tests from './tests';

export default {
  tests,
  transforms,
  base: {
    transforms: [{ type: 'base' }],
    tests: [{ type: 'typeCheck' }],
  },
};
