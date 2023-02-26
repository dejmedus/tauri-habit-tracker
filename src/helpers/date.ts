export const daysOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ordinal = (number: number) => {
  if (number > 3 && number < 21) return "th";
  switch (number % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const dateObj = () => {
  const day = new Date();
  return {
    fullDate: day,
    fullDateString: day.toDateString(),
    day: daysOfWeek[day.getDay()],
    dayNum: day.getDay(),
    month: months[day.getMonth()],
    date: day.getDate(),
    ordinal: ordinal(day.getDate()),
    year: day.getFullYear(),
  };
};

// https://stackoverflow.com/questions/542938/how-to-calculate-number-of-days-between-two-dates
export function daysBetween(lastStoredDate: Date) {
  return ((UTC(new Date()) - UTC(lastStoredDate)) / 24) * 60 * 60 * 1000; // milliseconds per day
}

function UTC(date: Date) {
  let result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0 // ...at 00:00:00 hours
  );

  // valueOf because typescript prefers a number
  // https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
  return result
    .setMinutes(result.getMinutes() - result.getTimezoneOffset())
    .valueOf();
}
