import { useState } from "react";

import { IHabit } from "../helpers/types";

const AddHabit = ({
  habits,
  newHabit,
  setNewHabit,
  updateHabits,
}: {
  habits: IHabit[];
  newHabit: string;
  setNewHabit: React.Dispatch<React.SetStateAction<string>>;
  updateHabits: React.Dispatch<React.SetStateAction<IHabit[]>>;
}) => {
  const colors = [
    "purple",
    "sky",
    "red",
    "orange",
    "blue",
    "yellow",
    "pink",
    "green",
  ];

  // cycle through colors as each new habits is created
  const [curColor, setCurColor] = useState<number>(0);

  return (
    <div className="flex addHabit-container submitForm">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (newHabit.trim() !== "") {
            updateHabits([
              ...habits,
              {
                name: newHabit,
                days: [false, false, false, false, false, false, false],
                schedule: [0, 1, 2, 3, 4, 5, 6],
                color: colors[curColor],
                streak: 0,
              },
            ]);

            setNewHabit("");
            setCurColor((cur) => (cur < colors.length - 1 ? cur + 1 : 0));
          }
        }}
      >
        <input
          aria-label="Add a habit"
          className="addHabit"
          onChange={(e) => setNewHabit(e.currentTarget.value)}
          value={newHabit}
          placeholder="Add a habit"
        />
        <button type="submit">+</button>
      </form>
    </div>
  );
};

export default AddHabit;
