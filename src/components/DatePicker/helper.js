export const NOW = new Date();

export const getYear = (date = NOW) => date.getFullYear();
export const getMonth = (date = NOW) => date.getMonth();
export const getDate = (date = NOW) => date.getDate();

export const THIS_YEAR = NOW.getFullYear();

export const THIS_MONTH = NOW.getMonth();

export const THIS_DAY = NOW.getDate();

export const MIN_YEAR = 1970;
export const MAX_YEAR = 2070;
export const CALENDAR_MONTHS = [
    {
        name: 'January',
        shortName: "Jan",
    },
    {
        name: 'February',
        shortName: "Feb",
    },
    {
        name: 'March',
        shortName: "Mar",
    },
    {
        name: 'April',
        shortName: "Apr",
    },
    {
        name: 'May',
        shortName: "May",
    },
    {
        name: 'June',
        shortName: "Jun",
    },
    {
        name: 'July',
        shortName: "Jul",
    },
    {
        name: 'August',
        shortName: "Aug",
    },
    {
        name: 'September',
        shortName: "Sep",
    },
    {
        name: 'October',
        shortName: "Oct",
    },
    {
        name: 'November',
        shortName: "Nov",
    },
    {
        name: 'December',
        shortName: "Dec"
    },
]

export const CALENDAR_WEEKS = 6;

export const zeroPad = (value, length = 2) => {
  return `${value}`.padStart(length, '0');
}

export const isLeapYear = (year) => year % 4 === 0;
export const getMonthDays = (month = THIS_MONTH, year = THIS_YEAR) => {
  const months30 = [3, 5, 8, 10];
  const leapYear = isLeapYear(year);

  return month === 1
    ? leapYear
      ? 29
      : 28
    : months30.includes(month)
      ? 30
      : 31;
}

export const getMonthFirstDay = (month = THIS_MONTH, year = THIS_YEAR) => {
  return +(new Date(`${year}-${zeroPad(month, 2)}-01`).getDay()) + 1;
}