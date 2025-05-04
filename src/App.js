import React, { useState, useEffect } from "react";
import "./App.css";

import PathfindingVisualizer from "./PathfindingVisualizer";

function App() {
const [showIntro, setShowIntro] = useState(true);  // Always show intro initially

const handleStart = () => {
  setShowIntro(false);  
};

  return (
    <div className="App">
      {showIntro ? (
        <div className="overlay">
          <div className="messageBox">
            <h2>👋 Welcome to the Pathfinding Visualizer!</h2>
            <p>
              Explore the journey from <strong>Start</strong> to <strong>End</strong> using powerful algorithms:
            </p>
            <ul>
              <li>🚀 <strong>Dijkstra’s Algorithm</strong></li>
              <li>🔍 <strong>BFS</strong></li>
              <li>🧭 <strong>DFS</strong></li>
              <li>💡 <strong>Greedy Best-First Search</strong></li>
              <li>🌟 <strong>A* Search</strong></li>
            </ul>
            <p>
              👉 Click to add walls. Double-click or use "Set Weight" to assign weights. Check the "Use Weighted Graph"
              box to include weights.
            </p>
            <p>
              🧹 Use "Erase" to clear everything except Start/End nodes. Click "Stop" to cancel an algorithm. Move
              Start/End by using "Set Start"/"Set End".
            </p>
            <button onClick={handleStart}>Let’s Get Started!</button>
          </div>
        </div>
      ) : (
        <PathfindingVisualizer />
      )}
    </div>
  );
}

export default App;
