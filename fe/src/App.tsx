import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div className="logos">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="counter">
        <button onClick={() => setCount((prev) => prev + 1)}>
          Count is {count}
        </button>
      </div>
      <p className="instructions">
        Edit <code>src/App.tsx</code> and save to test HMR.
      </p>
    </div>
  );
}

export default App;
