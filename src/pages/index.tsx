import { use, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { getClient, ResponseType } from "@tauri-apps/api/http";

function App() {
  const [catFact, setCatFact] = useState("");
  const [name, setName] = useState("");
  const [nameEditInput, setNameEditInput] = useState("");
  const [habitArr, setHabitArr] = useState([]);
  const [editName, setEditName] = useState(null);

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
      {habitArr != null
        ? habitArr.map((habit, habitIndex) => {
            const handlePress = (e) => {
              if (e.key === "Enter") {
                setEditName(null);

                let updatedArr = [...habitArr];
                updatedArr[habitIndex].name = nameEditInput;
                setHabitArr(updatedArr);
              }
            };

            return (
              <div className="flex">
                {habitIndex == editName ? (
                  <input
                    className="habitName"
                    onKeyDown={handlePress}
                    onChange={(e) => {
                      setNameEditInput(e.currentTarget.value);
                    }}
                    value={nameEditInput}
                    placeholder={nameEditInput}
                    autoFocus={true}
                  />
                ) : (
                  <p
                    onDoubleClick={() => {
                      setNameEditInput(habit.name);
                      setEditName(habitIndex);
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
                        id={dayIndex}
                        onClick={() => {
                          let updatedArr = [...habitArr];
                          updatedArr[habitIndex].days[dayIndex] =
                            !updatedArr[habitIndex].days[dayIndex];
                          setHabitArr(updatedArr);
                        }}
                        className={`box flex ${
                          day == true ? "complete" : null
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            );
          })
        : null}

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
