import { useState } from "react";
import Wizard from "./Wizard.jsx";
import Landing from "./Landing.jsx";
import FriendAI from "./FriendAI.jsx";

export default function App() {
  const [view, setView] = useState("landing");

  return (
    <div>
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 10, display: "flex", gap: 8 }}>
        <button onClick={() => setView("landing")} style={navBtn(view === "landing")}>Landing</button>
        <button onClick={() => setView("wizard")} style={navBtn(view === "wizard")}>Wizard</button>
        <button onClick={() => setView("friend")} style={navBtn(view === "friend")}>Friend AI</button>
      </div>
      {view === "landing" && <Landing onStart={() => setView("wizard")} />}
      {view === "wizard" && <Wizard />}
      {view === "friend" && <FriendAI />}
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
