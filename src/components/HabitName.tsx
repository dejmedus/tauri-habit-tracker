import React from "react";

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
  setInputOpen,
  inputOpenRef,
  setModal,
  setEditHabit,
}) => {
  return (
    <p
      // open modal
      onClick={() => {
        // delay onClick in case of onDoubleClick (edit habit input)
        setTimeout(() => {
          // if edit habit input is not open, setModal state to IModal
          // modal opens on non-null state
          inputOpenRef.current == null &&
            setModal({
              ...habits[habitIndex],
              habitIndex: habitIndex,
              longestStreak: longestStreak(habits[habitIndex].days),
            });
        }, 200);
      }}
      // open edit habit input
      onDoubleClick={() => {
        setEditHabit(habit.name);
        setInputOpen(habitIndex);
      }}
      className="habitName"
    >
      {habit.name}
    </p>
  );
};

export default HabitName;
