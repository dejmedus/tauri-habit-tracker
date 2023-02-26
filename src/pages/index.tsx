import { useEffect, useState, useRef } from "react";
import { dateObj, daysOfWeek, daysBetween } from "../helpers/date";
import { IToday, IHabit } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

function App() {
  const [newHabit, setNewHabit] = useState("");
  const [editHabit, setEditHabit] = useState("");

  const [modal, setModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const [inputOpen, setInputOpen] = useState(null);
  const inputOpenRef = useRef(inputOpen);

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
  const [curColor, setCurColor] = useState(0);

  const [today, setToday] = useState<IToday>(dateObj);
  const [habits, setHabits] = useState<IHabit[]>([]);

  useEffect(() => {
    // setTimeout, triggers at 12am
    resetAtMidnight(reset);

    // when we click outside input, close input
    window.addEventListener("click", () => setInputOpen(null));

    if (localStorage.getItem("habits") !== null) {
      setHabits(JSON.parse(localStorage.habits));
    }

    if (localStorage.fullDate !== null) {
      let lastStoredDate = new Date(localStorage.fullDate);

      // if days have passes since last app use
      // if this doesn't like midnight changes, lastStoredDate < today.fullDate
      if (lastStoredDate !== today.fullDate) {
        // add those days to habit history
        let updatedArr = [...habits];

        updatedArr.forEach((habit) => {
          habit.days = [
            ...habit.days,
            ...Array(daysBetween(lastStoredDate)).fill(false),
          ];
          habit.streak = 0;
        });

        updateHabits(updatedArr);
      }
    }

    // set today as new lastStoredDate
    localStorage.fullDate = JSON.stringify(today.fullDate);
  }, []);

  useEffect(() => {
    inputOpenRef.current = inputOpen;
  }, [inputOpen]);

  function updateHabits(updatedArr: IHabit[]) {
    setHabits(updatedArr);
    localStorage.habits = JSON.stringify(updatedArr);
  }

  // triggers at midnight
  function reset() {
    setToday(dateObj);

    console.log("reset");
    let updatedArr = [...habits];
    updatedArr.forEach((habit) => {
      habit.days.push(false);
      habit.streak = 0;
    });

    updateHabits(updatedArr);

    // set today as new lastStoredDate
    localStorage.fullDate = JSON.stringify(today.fullDate);
  }

  // update habit schedule
  function toggleScheduleDate(e: React.MouseEvent<HTMLButtonElement>) {
    let element = e.target as HTMLButtonElement;

    const dayNum = parseInt(element.value);
    let newSchedule = modal.schedule;

    newSchedule = newSchedule.includes(dayNum)
      ? newSchedule.filter((a: number) => a != dayNum)
      : newSchedule.push(dayNum);

    setModal({ ...modal, schedule: newSchedule });
    console.log("new", newSchedule);
    console.log(modal.schedule);
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
                    updateHabits(updatedArr);
                  }
                }
              };

              // offset is the number of hidden, previous boxes
              const offset = habit.days.length - 7;
              let completeCount = 0;

              // if habit is scheduled to be completed today or if schedule is empty return it
              return habit.schedule.length == 0 ||
                habit.schedule.includes(today.dayNum) ? (
                <div className="flex" key={habit.name}>
                  {habitIndex == inputOpen ? (
                    <input
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
                          const target = e.target as HTMLTextAreaElement;
                          inputOpenRef.current == null &&
                            setModal({
                              ...habits[target.id],
                              habitIndex: habitIndex,
                              curName: habits[target.id].name,
                              longestStreak: longestStreak(
                                habits[target.id].days
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

                              updateHabits(updatedArr);
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
              setCurColor((cur) => (cur < colors.length - 1 ? cur + 1 : 0));
              localStorage.habits = JSON.stringify(habits);
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
          <button
            onClick={(e) => {
              e.preventDefault();
              updateHabits([]);
            }}
          >
            DELETE ALL
          </button>
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
              updatedArr[modal.habitIndex].color = modal.color;
              updateHabits(updatedArr);
              setModal(null);
            }}
          >
            <div>
              <input
                // className="addHabit"
                onChange={(e) => setModal({ ...modal, name: e.target.value })}
                value={modal.name}
                placeholder={modal.name}
              />

              <p>
                Longest Streak: {modal.longestStreak}{" "}
                {modal.longestStreak !== 0 &&
                modal.streak == modal.longestStreak
                  ? "🔥"
                  : null}
              </p>
              <p>Current Streak: {modal.streak}</p>
              {/* currentColor */}

              <label htmlFor="colors">Color:</label>
              <select
                id="colors"
                value={modal.color}
                onChange={(e) => setModal({ ...modal, color: e.target.value })}
              >
                <option value="purple">purple</option>
                <option value="sky">sky</option>
                <option value="pink">pink</option>
                <option value="yellow">yellow</option>
                <option value="blue">blue</option>
                <option value="red">red</option>
                <option value="green">green</option>
                <option value="orange">orange</option>
              </select>

              <div className="flex">
                <button value="0" onClick={toggleScheduleDate}>
                  S
                </button>
                <button value="1" onClick={toggleScheduleDate}>
                  M
                </button>
                <button value="2" onClick={toggleScheduleDate}>
                  T
                </button>
                <button value="3" onClick={toggleScheduleDate}>
                  W
                </button>
                <button value="4" onClick={toggleScheduleDate}>
                  Th
                </button>
                <button value="5" onClick={toggleScheduleDate}>
                  F
                </button>
                <button value="6" onClick={toggleScheduleDate}>
                  S
                </button>
              </div>
              {/* schedule */}
              <button
                className="link-button"
                value={modal.habitIndex}
                onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                  let element = e.target as HTMLButtonElement;
                  e.preventDefault();
                  setDeleteModal(parseInt(element.value));
                }}
              >
                Delete {modal.curName}
              </button>
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      ) : null}
      {deleteModal !== null ? (
        <div className="deleteModal">
          Are you sure you want to delete{" "}
          <span>{habits[deleteModal].name}</span>?
          <div className="flex">
            <button
              onClick={() => {
                setDeleteModal(null);
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // delete habit
                let updatedArr = [...habits];
                updatedArr.splice(deleteModal, 1);
                updateHabits(updatedArr);
                setDeleteModal(null);
                setModal(null);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;

function longestStreak(days: boolean[]) {
  let streak = 0;
  let highestStreak = 0;
  for (let i = 0; i < days.length; i++) {
    streak = days[i] == true ? streak + 1 : 0;
    highestStreak = streak > highestStreak ? streak : highestStreak;
  }
  return highestStreak;
}
