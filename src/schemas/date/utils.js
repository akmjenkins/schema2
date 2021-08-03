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
