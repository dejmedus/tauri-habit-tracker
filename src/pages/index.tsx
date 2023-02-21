import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { getClient, ResponseType } from "@tauri-apps/api/http";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [catFact, setCatFact] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function getCatFact() {
    console.log("cat fact");
    const client = await getClient();
    const response = await client.get("meowfacts.herokuapp.com/", {
      timeout: 30,
      // the expected response type
      responseType: ResponseType.JSON,
    });
    console.log(response);
    setCatFact(response.data[0]);
  }
  return (
    <div className="container">
      <h1>Habits 🌳</h1>

      <div className="row"></div>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
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
      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
