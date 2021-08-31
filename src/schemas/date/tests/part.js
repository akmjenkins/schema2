import { makeParams } from '../../utils';

const METHOD_MAP = {
  day: 'getDay',
  date: 'getDate',
  year: 'getFullYear',
  month: 'getMonth',
  hours: 'getHours',
  minutes: 'getMinutes',
  seconds: 'getSeconds',
  milliseconds: 'getMilliseconds',
};

const UTC_METHOD_MAP = {
  day: 'getUTCDay',
  date: 'getUTCDate',
  year: 'getUTCFullYear',
  month: 'getUTCMonth',
  hours: 'getUTCHours',
  minutes: 'getUTCMinutes',
  seconds: 'getUTCSeconds',
  milliseconds: 'getUTCMilliseconds',
};

export default ({ part, tests, utc = true }) =>
  (value, { resolve, createError, is }) => {
    const resolved = {
      part: resolve(part),
      tests: resolve(tests).map(resolve),
      utc: resolve(utc),
    };

    const map = utc ? UTC_METHOD_MAP : METHOD_MAP;
    const method = map[resolved.part];

    if (!method)
      throw new Error(
        `part must be one of ${Object.keys(map)} - received ${resolved.part}`,
      );

    return (
      is({ type: 'number', tests: resolved.tests }, value[method]()) ||
      createError(makeParams({ resolved }))
    );
  };
