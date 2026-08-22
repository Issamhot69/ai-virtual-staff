import { useState } from "react";
import Wizard from "./Wizard.jsx";
import Landing from "./Landing.jsx";

export default function App() {
  const [view, setView] = useState("landing");

  return (
    <div>
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", gap: 8 }}>
        <button onClick={() => setView("landing")} style={navBtn(view === "landing")}>Landing</button>
        <button onClick={() => setView("wizard")} style={navBtn(view === "wizard")}>Wizard</button>
      </div>
      {view === "landing" ? <Landing onStart={() => setView("wizard")} /> : <Wizard />}
    </div>
  );
}

function navBtn(active) {
  return {
    background: active ? "#D4A54A" : "#141209",
    color: active ? "#1A1508" : "#EDE7D9",
    border: "1px solid #262115",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: 12,
    cursor: "pointer",
  };
}
