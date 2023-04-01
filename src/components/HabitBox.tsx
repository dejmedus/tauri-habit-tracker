import { daysOfWeek } from "../helpers/date";

const HabitBox = ({
  habit,
  habitIndex,
  habits,
  updateHabits,
  dayIndex,
  complete,
  completeCount,
  today,
}) => {
  // offset is the number of hidden, previous boxes
  const offset = habit.days.length - 7;

  // get the number of this box's dayOfTheWeek
  // first day box should be tomorrows date
  // last day box should be todays date
  let dayNumber = today.dayNum - (6 - dayIndex);
  dayNumber = dayNumber < 0 ? 7 + dayNumber : dayNumber;

  return (
    <button
      key={dayIndex}
      onClick={() => {
        let updatedArr = [...habits];

        // toggle habit complete
        let days = updatedArr[habitIndex].days;
        days[offset + dayIndex] = !days[offset + dayIndex];

        // update streak
        let streak = 0;

        for (let i = days.length - 1; i >= 0; i--) {
          if (days[i] == true) {
            streak++;
          } else {
            break;
          }
        }
        updatedArr[habitIndex].streak = streak;

        updateHabits(updatedArr);
      }}
      className={`box flex ${
        complete == true ? `complete${completeCount} ${habit.color}` : ""
      }`}
      disabled={!habit.schedule.includes(dayNumber)}
    >
      {daysOfWeek[dayNumber][0]}
    </button>
  );
};

export default HabitBox;
