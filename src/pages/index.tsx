import { useEffect, useState, useRef } from "react";
import { dateObj, daysOfWeek } from "../helpers/date";
import { IToday, IHabit } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

function App() {
  const [newHabit, setNewHabit] = useState("");
  const [editHabit, setEditHabit] = useState("");

  const [modal, setModal] = useState(null);

  const [inputOpen, setInputOpen] = useState(null);
  const inputOpenRef = useRef(inputOpen);

  const colors = ["purple", "sky", "orange", "blue", "pink", "green"];
  const [curColor, setCurColor] = useState(0);

  const [today, setToday] = useState<IToday>(dateObj);
  const [habits, setHabits] = useState<IHabit[]>([]);

  useEffect(() => {
    // setTimeOut, triggers at 12am
    resetAtMidnight(reset);

    // when we click outside input, close input
    window.addEventListener("click", () => setInputOpen(null));

    if (localStorage.getItem("habits") !== null) {
      setHabits(JSON.parse(localStorage.habits));
    }
  }, []);

  useEffect(() => {
    inputOpenRef.current = inputOpen;
  }, [inputOpen]);

  useEffect(() => {
    localStorage.habits = JSON.stringify(habits);
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
      <h2>{`${today.day} ${today.month} ${today.date}${today.ordinal}`}</h2>
      <div className="habits">
        {habits != null
          ? habits.map((habit, habitIndex) => {
              // if input is not empty, update habit name
              const handlePress = (e) => {
                if (e.key === "Enter") {
                  setInputOpen(null);

                  if (editHabit.trim() !== "") {
                    let updatedArr = [...habits];
                    updatedArr[habitIndex].name = editHabit;
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
                        setEditHabit(e.currentTarget.value);
                      }}
                      value={editHabit}
                      placeholder={editHabit}
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
                              longestStreak: longestStreak(
                                habits[e.target.id].days
                              ),
                            });
                        }, 200);
                        return () => clearTimeout(timeout);
                      }}
                      onDoubleClick={() => {
                        setEditHabit(habit.name);
                        setInputOpen(habitIndex);
                      }}
                      className="habitName"
                      id={habitIndex}
                    >
                      {habit.name}
                    </p>
                  )}

                  {/* habits */}
                  <div className="boxes flex">
                    {habit.days
                      .slice(habit.days.length - 7)
                      .map((complete, dayIndex) => {
                        let dayNumber = today.dayNum - (6 - dayIndex);
                        dayNumber = dayNumber < 0 ? 7 + dayNumber : dayNumber;
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
                                for (let i = days.length - 1; i > 0; i--) {
                                  if (days[i]) {
                                    streak++;
                                  } else {
                                    break;
                                  }
                                }
                                updatedArr[habitIndex].streak = streak;
                              }

                              setHabits(updatedArr);
                              console.log(habits);
                            }}
                            className={`box flex ${
                              complete == true
                                ? `complete${++completeCount} ${habit.color}`
                                : ""
                            }`}
                          >
                            {daysOfWeek[dayNumber][0]}
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

            if (newHabit.trim() !== "") {
              setHabits((cur) => [
                ...cur,
                {
                  name: newHabit,
                  days: [false, false, false, false, false, false, false],
                  schedule: [],
                  color: colors[curColor],
                  streak: 0,
                },
              ]);
              setNewHabit("");
              setCurColor((cur) => (cur <= colors.length ? cur + 1 : 0));
            }
          }}
        >
          <input
            className="addHabit"
            onChange={(e) => setNewHabit(e.currentTarget.value)}
            value={newHabit}
            placeholder="Add a Task..."
          />
          <button type="submit">+</button>
        </form>
      </div>

      {/* modal = {...habit, habitIndex} */}
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

            <p>
              Longest Streak: {modal.longestStreak}{" "}
              {modal.streak == modal.longestStreak ? "🔥" : null}
            </p>
            <p>Current Streak: {modal.streak}</p>
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

function longestStreak(days: boolean[]) {
  let streak = 0;
  for (let i = 0; i < days.length; i++) {
    streak = days[i] == true ? streak + 1 : 0;
  }
  return streak;
}
