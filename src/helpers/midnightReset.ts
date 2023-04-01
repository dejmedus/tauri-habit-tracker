// creates a setTimeout that will trigger at midnight and update the Habits app
// https://stackoverflow.com/questions/26306090/running-a-function-everyday-midnight
export default function resetAtMidnight(reset) {
  let now = new Date();
  let night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    0,
    0,
    0 // ...at 00:00:00 hours
  );

  let msToMidnight = night.getTime() - now.getTime();

  // reset function will be added to event queue after msToMidnight has passed
  setTimeout(function () {
    reset();
    resetAtMidnight(reset); // reset the timeout
  }, msToMidnight);
}
