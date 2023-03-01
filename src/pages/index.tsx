import { useEffect, useState, useRef } from "react";
import { dateObj, daysOfWeek, daysBetween } from "../helpers/date";
import { IToday, IHabit } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";
import Modal from "../components/Modal";

function App() {
  const [newHabit, setNewHabit] = useState("");
  const [editHabit, setEditHabit] = useState("");

  const [modal, setModal] = useState(null);

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
  const habitsRef = useRef(habits);

  useEffect(() => {
    let storedHabits = [];

    if (localStorage.getItem("habits") !== null) {
      storedHabits = JSON.parse(localStorage.habits);
      setHabits(JSON.parse(localStorage.habits));
    }

    // setTimeout, triggers at 12am
    resetAtMidnight(reset);

    if (localStorage.getItem("fullDate") !== null) {
      let lastStoredDate = new Date(JSON.parse(localStorage.fullDate));

      // if days have passes since last app use
      // typeof(lastStoredDate) object typeof(today.fullDate) "object" ??
      if (lastStoredDate.toString() !== today.fullDate.toString()) {
        if (storedHabits.length > 0) {
          // add those days to habit history
          let updatedArr = [...storedHabits];

          for (let i = 0; i < updatedArr.length; i++) {
            updatedArr[i].days = [
              ...updatedArr[i].days,
              ...new Array(daysBetween(lastStoredDate)).fill(false),
            ];
            updatedArr[i].streak = 0;
          }

          updateHabits(updatedArr);
        }
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
    habitsRef.current = updatedArr;
    localStorage.habits = JSON.stringify(updatedArr);
  }

  // triggers at midnight
  function reset() {
    setToday(dateObj);

    if (habitsRef.current.length !== 0) {
      let updatedArr = [...habitsRef.current];
      updatedArr.forEach((habit) => {
        habit.days.push(false);
        habit.streak = 0;
      });

      updateHabits(updatedArr);
    }

    // set today as new lastStoredDate
    localStorage.fullDate = JSON.stringify(today.fullDate);
  }

  return (
    <div
      className="container"
      onClick={(e) => {
        e.stopPropagation();
        const element = e.target as HTMLTextAreaElement;

        if (element.dataset.noevent == null) {
          console.log(e.target);
          setInputOpen(null);
        }
      }}
    >
      <h2>{`${today.day} ${today.month} ${today.date}${today.ordinal}`}</h2>
      <div className="habits">
        {habits != null
          ? habits.map((habit, habitIndex) => {
              // offset is the number of hidden, previous boxes
              const offset = habit.days.length - 7;
              let completeCount = 0;

              // only return habits scheduled for today
              return habit.schedule.includes(today.dayNum) ? (
                <div className="flex" key={habit.name}>
                  {habitIndex == inputOpen ? (
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
                  ) : (
                    <p
                      data-id={habitIndex}
                      onClick={(e) => {
                        const timeout = setTimeout(() => {
                          // check if edit habit input is open
                          // if not, open modal
                          const element = e.target as HTMLTextAreaElement;

                          inputOpenRef.current == null &&
                            setModal({
                              ...habits[element.dataset.id],
                              habitIndex: habitIndex,
                              longestStreak: longestStreak(
                                habits[element.dataset.id].days
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
                          <button
                            key={dayIndex}
                            onClick={() => {
                              let updatedArr = [...habits];

                              // toggle habit complete
                              let days = updatedArr[habitIndex].days;
                              days[offset + dayIndex] =
                                !days[offset + dayIndex];

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
                              complete == true
                                ? `complete${++completeCount} ${habit.color}`
                                : ""
                            }`}
                            disabled={!habit.schedule.includes(dayNumber)}
                          >
                            {daysOfWeek[dayNumber][0]}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ) : null;
            })
          : null}
      </div>

      {/* add a habit */}
      <div className="flex submitForm">
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
            className="addHabit"
            onChange={(e) => setNewHabit(e.currentTarget.value)}
            value={newHabit}
            placeholder="Add a habit..."
          />
          <button type="submit">+</button>
        </form>
      </div>

      {modal != null ? (
        <Modal
          modal={modal} // {...habit, habitIndex, longestStreak}
          setModal={setModal}
          habits={habits}
          updateHabits={updateHabits}
        />
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
