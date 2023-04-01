import { useEffect, useState, useRef } from "react";

import { dateObj, daysBetween } from "../helpers/date";
import { IToday, IHabit, IModal } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

import HabitName from "../components/HabitName";
import HabitBox from "../components/HabitBox";
import Modal from "../components/Modal";
import AddHabit from "../components/AddHabit";
import EditHabitName from "../components/EditHabitName";

function App() {
  const [newHabit, setNewHabit] = useState<string>("");
  const [editHabit, setEditHabit] = useState<string>("");

  const [modal, setModal] = useState<IModal | null>(null);

  // EditHabitName toggle, habitIndex | null
  const [inputOpen, setInputOpen] = useState<number | null>(null);
  const inputOpenRef = useRef(inputOpen);

  const [today, setToday] = useState<IToday>(dateObj);

  const [habits, setHabits] = useState<IHabit[]>([]);
  const habitsRef = useRef(habits);

  useEffect(() => {
    if (localStorage.getItem("habits") !== null) {
      habitsRef.current = JSON.parse(localStorage.habits);
      setHabits(JSON.parse(localStorage.habits));
    }

    // setTimeout, triggers at 12am
    resetAtMidnight(reset);

    if (localStorage.getItem("fullDate") !== null) {
      let lastStoredDate = new Date(JSON.parse(localStorage.fullDate));

      // if days have passes since last app use
      if (lastStoredDate.toString() != today.fullDate.toString()) {
        // if habits array isn't empty
        if (habitsRef.current.length > 0) {
          // add those missed days to habit history
          let updatedArr = [...habitsRef.current];

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
    <div
      className="container"
      onClick={(e) => {
        const element = e.target as HTMLTextAreaElement;

        // if an edit habit name input is open/inputOpen is set to habitIndex
        if (inputOpen !== null) {
          // if click is outside of the input, close input without saving
          if (element.dataset.noevent == null) {
            setInputOpen(null);
          }
        }
      }}
    >
      {/* display todays date */}
      <h2>{`${today.day} ${today.month} ${today.date}${today.ordinal}`}</h2>

      <div className="habits">
        {habits != null
          ? habits.map((habit, habitIndex) => {
              // only return habits scheduled for today
              return habit.schedule.includes(today.dayNum) ? (
                <div className="flex" key={habit.name}>
                  {/* if habit at this index has been double clicked */}
                  {/* show input to edit habit name */}
                  {habitIndex == inputOpen ? (
                    <EditHabitName
                      editHabit={editHabit}
                      setEditHabit={setEditHabit}
                      habitIndex={habitIndex}
                      habits={habits}
                      updateHabits={updateHabits}
                      setInputOpen={setInputOpen}
                      modal={modal}
                    />
                  ) : (
                    <HabitName
                      habit={habit}
                      habitIndex={habitIndex}
                      habits={habits}
                      setInputOpen={setInputOpen}
                      inputOpenRef={inputOpenRef}
                      setModal={setModal}
                      setEditHabit={setEditHabit}
                    />
                  )}

                  {/* habits */}
                  <div className="boxes flex">
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
