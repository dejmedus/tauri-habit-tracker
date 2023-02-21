// https://stackoverflow.com/questions/26306090/running-a-function-everyday-midnight
export default function resetAtMidnight(reset) {
  var now = new Date();
  var night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1, // the next day, ...
    0,
    0,
    0 // ...at 00:00:00 hours
  );
  var msToMidnight = night.getTime() - now.getTime();

  setTimeout(function () {
    reset();
    resetAtMidnight(reset); //      Then, reset again next midnight.
  }, msToMidnight);
}