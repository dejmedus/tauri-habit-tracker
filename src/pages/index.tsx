import { useEffect, useState } from "react";
import { dateObj, daysOfWeek } from "../helpers/date";
import { IToday } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

function App() {
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [modal, setModal] = useState(false);

  const [inputOpen, setInputOpen] = useState(null);
  const [today, setToday] = useState<IToday>(dateObj);
  const [habitArr, setHabitArr] = useState([
    {
      name: "habit1",
      days: [false, false, false, false, false, true, true],
      schedule: [],
    },
    {
      name: "should show on wednesday",
      days: [false, false, false, false, false, true, true],
      schedule: [3],
    },
    {
      name: "tues, thurs, fri",
      days: [false, false, false, true, false, false, false],
      schedule: [2, 4, 5],
    },
  ]);
  // habitArr [{
  //   name: name,
  //   days: [false, false, false, false, false, false, false],
  //   schedule: [0, 2]
  // }]

  // triggers at midnight
  function reset() {
    setToday(dateObj);

    let updatedArr = [...habitArr];
    updatedArr.forEach((habit) => {
      habit.days.push(false);
    });

    setHabitArr(updatedArr);
  }

  useEffect(() => {
    // setTimeOut, triggers at 12am
    resetAtMidnight(reset);

    // when we click outside input, close input
    window.addEventListener("click", () => setInputOpen(null));
  }, []);

  function openModal() {
    setModal(true);
  }

  return (
    <div className="container">
      <h2>{`${today.day} ${today.month} ${today.date}${today.ordinal(
        today.date
      )}`}</h2>
      <div className="habits">
        {habitArr != null
          ? habitArr.map((habit, habitIndex) => {
              const handlePress = (e) => {
                if (e.key === "Enter") {
                  setInputOpen(null);

                  let updatedArr = [...habitArr];
                  updatedArr[habitIndex].name = nameInput;
                  setHabitArr(updatedArr);
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
                        setNameInput(e.currentTarget.value);
                      }}
                      value={nameInput}
                      placeholder={nameInput}
                      autoFocus={true}
                    />
                  ) : (
                    <p
                      onClick={() => {
                        setTimeout(() => {
                          console.log(inputRef.current);
                        }, 2000);
                      }}
                      onDoubleClick={() => {
                        setNameInput(habit.name);
                        setInputOpen(habitIndex);
                      }}
                      className="habitName"
                    >
                      {habit.name}
                    </p>
                  )}
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
                              let updatedArr = [...habitArr];
                              updatedArr[habitIndex].days[offset + dayIndex] =
                                !updatedArr[habitIndex].days[offset + dayIndex];
                              setHabitArr(updatedArr);
                            }}
                            className={`box flex ${
                              complete == true
                                ? `complete${++completeCount}`
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
      <div className="flex">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setHabitArr((cur) => [
              ...cur,
              {
                name: name,
                days: [false, false, false, false, false, false, false],
                schedule: [],
              },
            ]);
            setName("");
          }}
        >
          <input
            className="addTask"
            onChange={(e) => setName(e.currentTarget.value)}
            value={name}
            placeholder="Add a Task..."
          />
          <button type="submit">+</button>
        </form>
      </div>
      {modal == true ? (
        <div className="modal">
          <svg
            onClick={() => setModal(false)}
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
          this is a modal
          <p>this is still a modal</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
