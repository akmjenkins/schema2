export const isValidDate = (val) =>
  val instanceof Date && !isNaN(val.getTime());

export const getTersity = (val, tersity) => {
  if (!tersity) return val;

  const [year, month, day, hours, minutes, seconds] = [
    val.getYear(),
    val.getMonth(),
    val.getDay(),
    val.getHours(),
    val.getMinutes(),
    val.getSeconds(),
  ];
  switch (tersity) {
    case 'seconds':
      return new Date(year, month, day, hours, minutes, seconds);
    case 'minutes':
      return new Date(year, month, day, hours, minutes);
    case 'hours':
      return new Date(year, month, day, hours);
    case 'day':
      return new Date(year, month, day);
    case 'month':
      return new Date(year, month);
    case 'year':
      return new Date(year);
  }
};
