// https://stackoverflow.com/questions/26306090/running-a-function-everyday-midnight
export default function resetAtMidnight(reset) {
  let now = new Date();
  let night = now;
  // the next day at 00:00:00 hours
  night.setDate(now.getDate() + 1);
  night.setHours(0, 0, 0);

  let msToMidnight = night.getTime() - now.getTime();

  const timeout = setTimeout(function () {
    reset();
    resetAtMidnight(reset); //      Then, reset again next midnight.
  }, msToMidnight);
  () => clearTimeout(timeout);
}
