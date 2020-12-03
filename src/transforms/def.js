import { createTransform } from '../utils';

export default createTransform((against) => (v, _, { resolve }) =>
  v === undefined ? resolve(against) : v,
);
