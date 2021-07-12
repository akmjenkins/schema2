import { getTersity } from '../utils';

export default () =>
  ({ tersity }) =>
  (value) =>
    getTersity(value, tersity);
