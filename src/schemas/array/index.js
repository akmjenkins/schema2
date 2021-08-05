import mixed from '../mixed';
import { extend } from '../utils';
import * as transforms from './transforms';
import * as tests from './tests';
import parser from './parser';
import merge from './merge';

export default extend(mixed, {
  tests,
  transforms,
  parser,
  merge,
  base: { transforms: [{ type: 'base' }] },
});
