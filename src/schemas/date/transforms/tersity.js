import { getTersity } from '../utils';

const tersity =
  ({ value: v }) =>
  (value, { resolve }) =>
    getTersity(value, resolve(v));

export default tersity;
