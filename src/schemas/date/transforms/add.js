import { add } from '../utils';

export default (params) =>
  (date, { resolve }) =>
    add(
      date,
      Object.entries(params).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: resolve(v) }),
        {},
      ),
    );
