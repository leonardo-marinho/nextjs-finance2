export const getStartEndDatesByMonth = (
  month: number,
  year: number,
): [Date, Date] => {
  const startDate = new Date(year, month - 1);
  const endDate = addMonths(startDate, 1);

  return [startDate, endDate];
};

export const getStartEndDatesByYear = (year: number): [Date, Date] => {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return [startDate, endDate];
};

export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);

  return newDate;
};

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
};

export const addWeeks = (date: Date, weeks: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + weeks * 7);

  return newDate;
};

export const lastDayOfMonth = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(0);

  return newDate;
};

export const resetTime = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

export const getSelectValueDateString = (date: Date): string =>
  date.toISOString().split('T')[0];

export const isValidDate = (date: Date): boolean =>
  date instanceof Date && !isNaN(date.getTime());
