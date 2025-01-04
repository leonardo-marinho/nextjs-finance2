const getStartEndDatesByMonth = (month: number, year: number): [Date, Date] => {
  const startDate = new Date(year, month - 1);
  const endDate = addMonths(startDate, 1);

  return [startDate, endDate];
};

const getStartEndDatesByYear = (year: number): [Date, Date] => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return [startDate, endDate];
};

const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
};

const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
};

const addWeeks = (date: Date, weeks: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + weeks * 7);

  return newDate;
};

const lastDayOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(0);

  return newDate;
};

const resetTime = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

const getSelectValueDateString = (date: Date): string =>
  date.toISOString().split('T')[0];

const isValidDate = (date: Date): boolean =>
  date instanceof Date && !isNaN(date.getTime());

export const DateUtils = {
  addDays,
  addMonths,
  addWeeks,
  getSelectValueDateString,
  getStartEndDatesByMonth,
  getStartEndDatesByYear,
  isValidDate,
  lastDayOfMonth,
  resetTime,
};
