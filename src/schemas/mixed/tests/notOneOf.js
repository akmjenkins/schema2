import { defined } from '../../../utils';
import { makeParams } from '../../utils';
export default ({ values = [], schemas = [] }) =>
  (value, { resolve, is, createError }) => {
    const resolved = {
      values: values.map(resolve),
      schemas: schemas.map(resolve).filter(defined),
    };

    return (
      (resolved.values.every((v) => v !== value) &&
        resolved.schemas.every((s) => !is(s, value))) ||
      createError(makeParams({ resolved }))
    );
  };
