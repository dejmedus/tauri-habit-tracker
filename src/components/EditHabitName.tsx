import { useState } from "react";

const EditHabitName = ({
  editHabit,
  setEditHabit,
  habitIndex,
  habits,
  updateHabits,
  setInputOpen,
  modal,
}) => {
  return (
    <input
      data-noevent="true"
      className="habitName"
      onKeyDown={(e) => {
        // if input is not empty, update habit name
        if (e.key === "Enter" && modal == null) {
          setInputOpen(null);

          if (editHabit.trim() !== "") {
            let updatedArr = [...habits];
            updatedArr[habitIndex].name = editHabit;
            updateHabits(updatedArr);
          }
        }
      }}
      onChange={(e) => {
        setEditHabit(e.currentTarget.value);
      }}
      value={editHabit}
      placeholder={editHabit}
      autoFocus={true}
    />
  );
};

export default EditHabitName;
