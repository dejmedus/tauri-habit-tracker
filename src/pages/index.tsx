import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { getClient, ResponseType } from "@tauri-apps/api/http";
import { dateObj, daysOfWeek } from "../helpers/date";
import { IToday } from "../helpers/types";
import resetAtMidnight from "../helpers/midnightReset";

function App() {
  const [catFact, setCatFact] = useState("");

  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");

  const [inputOpen, setInputOpen] = useState(null);
  let today: IToday = dateObj;
  const [habitArr, setHabitArr] = useState([]);
  // habitArr [{
  //   name: name,
  //   days: [false, false, false, false, false, false, false],
  // }]

  function reset() {
    // triggers at midnight

    // update date
    today = dateObj;

    const updatedArr = habitArr.forEach((habit) => {
      habit.days.push(false);
    });
  }

  useEffect(() => {
    // setTimeOut, triggers at 12am
    resetAtMidnight(reset);

    // when we click outside input, close input
    window.addEventListener("click", () => setInputOpen(null));
  }, []);

  async function getCatFact() {
    console.log("cat fact");
    const client = await getClient();
    const response = await client.get("https://meowfacts.herokuapp.com/", {
      timeout: 30,
      responseType: ResponseType.JSON,
    });

    setCatFact(response.data.data[0]);
  }

  return (
    <div className="container">
      <h1>{`${today.day} ${today.month} ${today.date}${today.ordinal(
        today.date
      )}`}</h1>
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
              return (
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
              );
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
                days: [
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                  true,
                  true,
                ],
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            getCatFact();
          }}
        >
          <button type="submit">Cat Fact</button>
        </form>
      </div>

      <p>{catFact}</p>
    </div>
  );
}

export default App;
