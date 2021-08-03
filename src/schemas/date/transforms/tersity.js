import { getTersity } from '../utils';

const tersity =
  ({ parser }) =>
  ({ value: v }) =>
  (value, { resolve }) =>
    getTersity(parser(value), resolve(v));

export default tersity;
