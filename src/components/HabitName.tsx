import { IHabit } from "../helpers/types";

function longestStreak(days: boolean[]) {
  let streak = 0;
  let highestStreak = 0;
  for (let i = 0; i < days.length; i++) {
    streak = days[i] == true ? streak + 1 : 0;
    highestStreak = streak > highestStreak ? streak : highestStreak;
  }
  return highestStreak;
}

const HabitName = ({
  habit,
  habitIndex,
  habits,
  setModal,
}: {
  habit: IHabit;
  habitIndex: number;
  habits: IHabit[];
  setModal: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <p
      // open modal
      onClick={() => {
        setModal({
          ...habits[habitIndex],
          habitIndex: habitIndex,
          longestStreak: longestStreak(habits[habitIndex].days),
        });
      }}
      className="habitName"
    >
      {habit.name}
    </p>
  );
};

export default HabitName;
