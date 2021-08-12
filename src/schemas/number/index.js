import mixed from '../mixed';
import { extend } from '../utils';
import * as transforms from './transforms';
import * as tests from './tests';

export default extend(mixed, {
  tests,
  transforms,
  base: { transforms: [{ type: 'base' }] },
});
