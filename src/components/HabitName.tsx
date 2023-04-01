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
      data-id={habitIndex}
      // open modal
      onClick={(e) => {
        // delay onClick in case of onDoubleClick (edit habit input)
        setTimeout(() => {
          const element = e.target as HTMLTextAreaElement;

          // if edit habit input is not open, setModal state to IModal
          // modal opens on non-null state
          inputOpenRef.current == null &&
            setModal({
              ...habits[element.dataset.id],
              habitIndex: habitIndex,
              longestStreak: longestStreak(habits[element.dataset.id].days),
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
