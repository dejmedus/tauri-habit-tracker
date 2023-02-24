import { useEffect, useState, useRef } from "react";
import { dateObj, daysOfWeek } from "../helpers/date";
import { IToday, IHabit } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

function App() {
  // add new habit
  const [habitName, setHabitName] = useState("");
  // double clicking on habit to edit name
  const [editHabitName, setEditHabitName] = useState("");

  const [modal, setModal] = useState(null);

  const [inputOpen, setInputOpen] = useState(null);
  const inputOpenRef = useRef(inputOpen);

  const colors = ["purple", "sky", "orange", "blue", "pink", "green"];
  const [curColor, setCurColor] = useState(0);

  useEffect(() => {
    inputOpenRef.current = inputOpen;
  }, [inputOpen]);

  const [today, setToday] = useState<IToday>(dateObj);
  const [habits, setHabits] = useState<IHabit[]>([]);

  useEffect(() => {
    // setTimeOut, triggers at 12am
    resetAtMidnight(reset);

    // when we click outside input, close input
    window.addEventListener("click", () => setInputOpen(null));

    if (localStorage.getItem("habits") !== null) {
      console.log("habits", habits);
      setHabits(JSON.parse(localStorage.habits));
    }
  }, []);

  useEffect(() => {
    localStorage.habits = JSON.stringify(habits);
    console.log("setting", habits);
  }, [habits]);

  // triggers at midnight
  function reset() {
    setToday(dateObj);

    console.log("reset");
    let updatedArr = [...habits];
    updatedArr.forEach((habit) => {
      habit.days.push(false);
    });

    setHabits(updatedArr);
  }

  return (
    <div className="container">
      <h2>{`${today.day} ${today.month} ${today.date}${today.ordinal(
        today.date
      )}`}</h2>
      <div className="habits">
        {habits != null
          ? habits.map((habit, habitIndex) => {
              const handlePress = (e) => {
                if (e.key === "Enter") {
                  setInputOpen(null);

                  if (editHabitName.trim() !== "") {
                    let updatedArr = [...habits];
                    updatedArr[habitIndex].name = editHabitName;
                    setHabits(updatedArr);
                  }
                }
              };

              // offset is the number of hidden, previous boxes
              const offset = habit.days.length - 7;
              let completeCount = 0;

              // if habit is scheduled to be completed today or if schedule is empty return it
              return habit.schedule.length == 0 ||
                habit.schedule.includes(today.dayNum) ? (
                <div className="flex">
                  {habitIndex == inputOpen ? (
                    <input
                      key={habit.name}
                      className="habitName"
                      onKeyDown={handlePress}
                      onChange={(e) => {
                        setEditHabitName(e.currentTarget.value);
                      }}
                      value={editHabitName}
                      placeholder={editHabitName}
                      autoFocus={true}
                    />
                  ) : (
                    <p
                      onClick={(e) => {
                        const timeout = setTimeout(() => {
                          // check if edit habit input is open
                          // if not, open modal
                          inputOpenRef.current == null &&
                            setModal({
                              ...habits[e.target.id],
                              habitIndex: habitIndex,
                            });
                        }, 200);
                        return () => clearTimeout(timeout);
                      }}
                      onDoubleClick={() => {
                        setEditHabitName(habit.name);
                        setInputOpen(habitIndex);
                      }}
                      className="habitName"
                      id={habitIndex}
                    >
                      {habit.name}
                    </p>
                  )}

                  {/*  */}
                  <div className="boxes flex">
                    {habit.days
                      .slice(habit.days.length - 7)
                      .map((complete, dayIndex) => {
                        let num = today.dayNum - (6 - dayIndex);
                        num = num < 0 ? 7 + num : num;
                        return (
                          <div
                            key={dayIndex}
                            id={dayIndex}
                            onClick={() => {
                              let updatedArr = [...habits];

                              // toggle habit complete
                              let days = updatedArr[habitIndex].days;
                              days[offset + dayIndex] =
                                !days[offset + dayIndex];

                              // update streak
                              if (days[days.length - 1] == true) {
                                let streak = 0;
                                for (let i = 0; i < days.length; i++) {
                                  if (days[i]) {
                                    streak++;
                                  } else {
                                    break;
                                  }
                                }
                                updatedArr[habitIndex].streak = streak;
                              }

                              setHabits(updatedArr);
                            }}
                            className={`box flex ${
                              complete == true
                                ? `complete${++completeCount} ${habit.color}`
                                : ""
                            }`}
                          >
                            {daysOfWeek[num][0]}
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : null;
            })
          : null}
      </div>

      {/* add a habit */}
      <div className="flex">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (habitName.trim() !== "") {
              setHabits((cur) => [
                ...cur,
                {
                  name: habitName,
                  days: [false, false, false, false, false, false, false],
                  schedule: [],
                  color: colors[curColor],
                  streak: null,
                },
              ]);
              setHabitName("");
              setCurColor((cur) => (cur <= colors.length ? cur + 1 : 0));
            }
          }}
        >
          <input
            className="addHabit"
            onChange={(e) => setHabitName(e.currentTarget.value)}
            value={habitName}
            placeholder="Add a Task..."
          />
          <button type="submit">+</button>
        </form>
      </div>

      {/* modal */}
      {modal != null ? (
        <div className="modal">
          <svg
            onClick={() => setModal(null)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              let updatedArr = [...habits];
              updatedArr[modal.habitIndex].name = modal.name;
              // updatedArr[modal.habitIndex].schedule = modal.schedule;
              // updatedArr[modal.habitIndex].color = modal.color;
              setHabits(updatedArr);
              setModal(null);
            }}
          >
            <input
              className="addHabit"
              onChange={(e) => setModal({ ...modal, name: e.target.value })}
              value={modal.name}
              placeholder={modal.name}
            />
            {/* currentColor */}
            {/* schedule */}
            <button type="submit">Save</button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default App;
