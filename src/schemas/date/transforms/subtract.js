import { subtract } from '../utils';

export default (params) =>
  (date, { resolve }) =>
    subtract(
      date,
      Object.entries(params).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: resolve(v) }),
        {},
      ),
    );
