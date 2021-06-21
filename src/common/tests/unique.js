import { get } from '../../get';
import { createValidator } from '../../utils';

/*

{
  tests: ['unique'],
  tests: [ ['unique', 'custom error message'] ],
  tests: [ ['unique, { by: 'some.path' }, 'custom error message' ]]
}

*/

export default createValidator(
  (...args) => (value, { resolve }, passError) => {
    const hasBy = args[0] && args[0].by;
    const by = hasBy ? args[0].by : '';
    const error = hasBy ? args[1] : args[0];

    return (
      value.length ===
        new Set(by ? value.map((f) => get(f, resolve(by))) : value).size ||
      passError(error)
    );
  },
  {
    allowSchemas: ['array'],
  },
);
