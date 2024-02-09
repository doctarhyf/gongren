const daysOfWeekFrench = ["D", "L", "M", "M", "J", "V", "S"];

function GetFrenchDayNamesUntilEndOfMonth(year, month) {
  const day = 21;

  const dateArray = [];
  let currentDate = new Date(year, month - 1, day);

  while (currentDate.getMonth() + 1 === month) {
    const dayOfWeekIndex = currentDate.getDay();
    const frenchDayName = daysOfWeekFrench[dayOfWeekIndex];

    dateArray.push(frenchDayName);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

function GetFrenchDayNamesUntil20th(year, month) {
  const day = 1;

  const dateArray = [];
  let currentDate = new Date(year, month - 1, day);

  while (currentDate.getDate() <= 20) {
    const dayOfWeekIndex = currentDate.getDay();
    const frenchDayName = daysOfWeekFrench[dayOfWeekIndex];

    dateArray.push(frenchDayName);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

function GetMonthLastDate(year, month, day) {
  // Create a new Date object based on the provided parameters
  const currentDate = new Date(year, month - 1, day);

  // Set the date to the first day of the next month
  currentDate.setMonth(currentDate.getMonth() + 1, 0);

  // Get the last date of the specified month
  const lastDateOfMonth = currentDate.getDate();

  return lastDateOfMonth;
}

export const GFMN = GetFrenchMonthName;

function GetFrenchMonthName(index) {
  // Validate that the index is within the range [1, 12]
  if (index < 1 || index > 12) {
    return "Invalid month index";
  }

  // Create a date object with the desired month (1-based) and get the localized month name
  const date = new Date(2000, index - 1, 1); // Using 2000 as an arbitrary year
  const monthName = date.toLocaleString("fr-FR", { month: "long" });

  return monthName;
}

export default function GetRoulemenDaysData(
  y = new Date().getFullYear(),
  m = new Date().getMonth() + 1,
  d = 21
) {
  // console.log("GetRoulemenDaysData", y, m, d);

  if (m > 12 || m < 1) {
    console.error("GetRoulemenDaysData", "Month cant be < 1 or > 12");
    return;
  }

  let currentYear = y;
  let nextYear = currentYear + 1;
  let prevYear = currentYear - 1;
  let currentMonth = m;
  let nextMonth = m + 1 > 12 ? 1 : m + 1;
  let prevMonth = m - 1 < 1 ? 12 : m - 1;

  let secondMonthYear = nextMonth === 1 ? nextYear : currentYear;
  let firstMonthYear = prevMonth === 12 ? prevYear : currentYear;

  let firstMonth;
  let secondMonth;

  if (d >= 21) {
    firstMonth = currentMonth;
    secondMonth = nextMonth;
    firstMonthYear = currentYear;
  }

  if (d < 21) {
    firstMonth = prevMonth;
    secondMonth = currentMonth;
  }

  const firstMonthLastDate = GetMonthLastDate(firstMonthYear, firstMonth, 1);
  const secondMonthLastDate = GetMonthLastDate(secondMonthYear, secondMonth, 1);
  const firstMonthRoulementDaysCount = firstMonthLastDate - 20;
  const totalRoulementDaysCount = firstMonthRoulementDaysCount + 20;
  let firstMonthDaysNames = GetFrenchDayNamesUntilEndOfMonth(
    firstMonthYear,
    firstMonth
  );
  let secondMonthDaysNames = GetFrenchDayNamesUntil20th(
    secondMonthYear,
    secondMonth
  );

  const daysNames = [...firstMonthDaysNames, ...secondMonthDaysNames];

  let firstMonthDates = [...Array(firstMonthRoulementDaysCount)].map(
    (d, i) => i + 21
  );
  let secondMonthDates = [...Array(20)].map((d, i) => i + 1);
  const dates = [...firstMonthDates, ...secondMonthDates];
  const defaultRoulementData = [...Array(dates.length).fill("-")].join("");

  const dateObj = {
    date: { y: y, m: m, d: d },
    firstMonth: firstMonth,
    secondMonth: secondMonth,
    seconMonthYear: secondMonthYear,
    firstMonthYear: firstMonthYear,
    firstMonthLastDate: firstMonthLastDate,
    secondMonthLastDate: secondMonthLastDate,
    firstMonthRoulementDaysCount: firstMonthRoulementDaysCount,
    totalRoulementDaysCount: totalRoulementDaysCount,
    firstMonthDaysNames: firstMonthDaysNames,
    secondMonthDaysNames: secondMonthDaysNames,
    firstMonthDates: firstMonthDates,
    secondMonthDates: secondMonthDates,
    dates: dates,
    defaultRoulementData: defaultRoulementData,
    daysNames: daysNames,
  };

  console.log(dateObj);

  return dateObj;
}
