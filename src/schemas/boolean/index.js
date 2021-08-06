import mixed from '../mixed';
import { extend } from '../utils';
import * as transforms from './transforms';

export default extend(mixed, {
  transforms,
  base: { transforms: [{ type: 'base' }] },
});
