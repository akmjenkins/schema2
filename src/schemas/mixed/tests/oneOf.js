import { defined } from '../../../utils';
import { makeParams } from '../../utils';

export default ({ values = [], schemas = [] }) =>
  (value, { resolve, is, createError }) => {
    const resolved = {
      values: values.map(resolve),
      schemas: schemas.map(resolve).filter(defined),
    };

    return (
      resolved.values.some((v) => v === value) ||
      resolved.schemas.some((s) => is(s, value)) ||
      createError(makeParams({ resolved }))
    );
  };
