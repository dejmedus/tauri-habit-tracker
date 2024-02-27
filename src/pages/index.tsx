import { useEffect, useState, useRef } from "react";

import { dateObj, daysBetween } from "../helpers/date";
import { IToday, IHabit, IModal } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

import HabitName from "../components/HabitName";
import HabitBox from "../components/HabitBox";
import Modal from "../components/Modal";
import AddHabit from "../components/AddHabit";

function App() {
  const [newHabit, setNewHabit] = useState<string>("");

  const [modal, setModal] = useState<IModal | null>(null);

  const [today, setToday] = useState<IToday>(dateObj);

  const [habits, setHabits] = useState<IHabit[]>([]);
  const habitsRef = useRef(habits);

  useEffect(() => {
    const loadStoredHabits = () => {
      try {
        const storedHabits = JSON.parse(localStorage.getItem("habits")) || [];
        if (storedHabits.length > 0) {
          habitsRef.current = storedHabits;
          setHabits(storedHabits);
        }
      } catch (error) {
        console.error("Error loading stored habits:", error);
      }
    };

    const updateHabitsIfDaysPassed = () => {
      try {
        if (localStorage.getItem("fullDate") !== null) {
          let lastStoredDate = new Date(JSON.parse(localStorage.fullDate));

          // if days have passed since last app use
          if (lastStoredDate.toString() != today.fullDate.toString()) {
            // if habits array isn't empty
            if (habitsRef.current.length > 0) {
              // add those missed days to habit history
              let updatedArr = [...habitsRef.current];

              for (let i = 0; i < updatedArr.length; i++) {
                let daysMissed = daysBetween(lastStoredDate);
                daysMissed = daysMissed < 0 ? 0 : daysMissed;
                updatedArr[i].days = [
                  ...updatedArr[i].days,
                  ...new Array(daysMissed).fill(false),
                ];
                updatedArr[i].streak = 0;
              }

              updateHabits(updatedArr);
            }
          }
        }
      } catch (error) {
        console.error("Error updating habits if days passed:", error);
      }
    };

    const setTodayAsLastStoredDate = () => {
      try {
        localStorage.fullDate = JSON.stringify(today.fullDate);
      } catch (error) {
        console.error("Error setting today as last stored date:", error);
      }
    };

    loadStoredHabits();
    resetAtMidnight(reset);
    updateHabitsIfDaysPassed();
    setTodayAsLastStoredDate();
  }, []);

  function updateHabits(updatedArr: IHabit[]) {
    setHabits(updatedArr);
    habitsRef.current = updatedArr;
    localStorage.habits = JSON.stringify(updatedArr);
  }

  // triggers at midnight
  function reset() {
    setToday(dateObj);

    // update habits array
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
    <div className="container">
      {/* display todays date */}
      <h2>{`${today.day} ${today.month} ${today.date}${today.ordinal}`}</h2>

      <div className="habits">
        {habits != null
          ? habits.map((habit, habitIndex) => {
              // amount of completed days in a week
              let completeCount = 0;

              // only return habits scheduled for today
              return habit.schedule.includes(today.dayNum) ? (
                <div className="flex" key={habit.name}>
                  <HabitName
                    habit={habit}
                    habitIndex={habitIndex}
                    habits={habits}
                    setModal={setModal}
                  />

                  {/* habits */}
                  <div className="flex boxes">
                    {habit.days
                      .slice(habit.days.length - 7)
                      .map((complete, dayIndex) => {
                        return (
                          <HabitBox
                            habit={habit}
                            habitIndex={habitIndex}
                            habits={habits}
                            updateHabits={updateHabits}
                            dayIndex={dayIndex}
                            complete={complete}
                            completeCount={complete ? ++completeCount : 0}
                            today={today}
                          />
                        );
                      })}
                  </div>
                </div>
              ) : null;
            })
          : null}
      </div>

      {/* add a habit */}
      <AddHabit
        habits={habits}
        newHabit={newHabit}
        setNewHabit={setNewHabit}
        updateHabits={updateHabits}
      />

      {modal != null ? (
        <Modal
          modal={modal}
          setModal={setModal}
          habits={habits}
          updateHabits={updateHabits}
        />
      ) : null}
    </div>
  );
}

export default App;
