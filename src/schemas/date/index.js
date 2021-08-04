import mixed from '../mixed';
import { extend } from '../utils';
import createDateTransforms from './transforms';
import createDateTests from './tests';

// date is a special schema - the user must pass in a parser to parse things into Date objects
// highly recommend sugardate for NLP abilities
// also can pass in a function that returns "now" for the purposes of past/future validators, haven't found a use case for it but I feel like it might pop up
// default parser is Date.parse (highly discouraged in production) and default now is Date.now
export default ({ now = Date.now, parser = Date.parse } = {}) =>
  extend(mixed, {
    tests: createDateTests({ now, parser }),
    transforms: createDateTransforms({ now, parser }),
    base: { transforms: [{ type: 'base' }], tests: [{ type: 'typeCheck' }] },
  });
