export const isValidDate = (val) =>
  val instanceof Date && !isNaN(val.getTime());

const TERSITY_MAP = {
  millisecond: (year, month, day, ...rest) =>
    new Date(Date.UTC(year, month, day, ...rest)),
  second: (year, month, day, hours, minutes, seconds) =>
    new Date(Date.UTC(year, month, day, hours, minutes, seconds)),
  minute: (year, month, day, hours, minutes) =>
    new Date(Date.UTC(year, month, day, hours, minutes)),
  hour: (year, month, day, hours) =>
    new Date(Date.UTC(year, month, day, hours)),
  day: (year, month, day) => new Date(Date.UTC(year, month, day)),
  month: (year, month) => new Date(Date.UTC(year, month)),
  year: (year) => new Date(Date.UTC(year)),
};

export const getTersity = (val, tersity) => {
  if (!tersity) return val;

  const fn = TERSITY_MAP[tersity];
  if (!fn) throw new Error(`tersity of ${tersity} is not supported`);
  return fn(
    val.getFullYear(),
    val.getMonth(),
    val.getDay(),
    val.getHours(),
    val.getMinutes(),
    val.getSeconds(),
    val.getMilliseconds(),
  );
};

export const add = (date, params) => manipulate(date, params);
export const subtract = (date, params) => manipulate(date, params, -1);

const MULTIPLIER_MAP = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
  weeks: 1000 * 60 * 60 * 24 * 7,
};

const manipulate = (
  date,

  {
    milliseconds = 0,
    seconds = 0,
    minutes = 0,
    hours = 0,
    days = 0,
    weeks = 0,
    months = 0,
    years = 0,
  },
  multiplier = 1,
) => {
  if (months || years) {
    // get the number of years to add
    const originalDate = date.getDate();
    const nextYear =
      date.getFullYear() + (years + Math.floor(months / 12)) * multiplier;
    const nextMonth = date.getMonth() + (months % 12) * multiplier;
    date = new Date(
      Date.UTC(
        nextYear,
        nextMonth,
        Math.min(originalDate, daysOf(nextYear)[nextMonth]),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
        date.getUTCMilliseconds(),
      ),
    );
  }

  if (milliseconds || seconds || minutes || hours || days || weeks) {
    date = new Date(
      +date +
        (milliseconds +
          MULTIPLIER_MAP.seconds * seconds +
          MULTIPLIER_MAP.minutes * minutes +
          MULTIPLIER_MAP.hours * hours +
          MULTIPLIER_MAP.days * days +
          MULTIPLIER_MAP.weeks * weeks) *
          multiplier,
    );
  }

  return date;
};

const daysOf = (year) => [
  31,
  daysInFeb(year),
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31,
];

const daysInFeb = (year) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
