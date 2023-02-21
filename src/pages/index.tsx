import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { getClient, ResponseType } from "@tauri-apps/api/http";
import { dateObj } from "../helpers/date";
import { IToday } from "../helpers/types";

function App() {
  const [catFact, setCatFact] = useState("");
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [habitArr, setHabitArr] = useState([]);
  const [inputOpen, setInputOpen] = useState(null);

  const [today, setToday] = useState<IToday>(dateObj);

  useEffect(() => {
    window.addEventListener("click", () => setInputOpen(null));
  }, []);

  // console.log("out out", inputOpen);

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
                    {habit.days.map((day, dayIndex) => {
                      habitArr[habitIndex].days[dayIndex];
                      return (
                        <div
                          key={dayIndex}
                          id={dayIndex}
                          onClick={() => {
                            let updatedArr = [...habitArr];
                            updatedArr[habitIndex].days[dayIndex] =
                              !updatedArr[habitIndex].days[dayIndex];
                            setHabitArr(updatedArr);
                          }}
                          className={`box ${day == true ? "complete" : null}`}
                        >
                          {today.dayNum - dayIndex}
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
                days: [false, false, false, false, false, false, false],
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
