import React from "react";

import { useState } from "react";
import Clock from "./components/Clock";
import Alarm from "./components/Alarm";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("clock");

  return (
    <div className="app">
      <div className="container">
        <header className="app-header">
          <h1>⏰ Smart Alarm</h1>
          
        </header>
        
        <nav className="tab-navigation">
          <button 
            className={tab === "clock" ? "tab-btn active" : "tab-btn"} 
            onClick={() => setTab("clock")}
          >
            <span className="tab-icon">🕒</span>
            <span className="tab-label">Clock</span>
          </button>
          <button 
            className={tab === "alarm" ? "tab-btn active" : "tab-btn"} 
            onClick={() => setTab("alarm")}
          >
            <span className="tab-icon">⏰</span>
            <span className="tab-label">Alarm</span>
          </button>
          <button 
            className={tab === "stopwatch" ? "tab-btn active" : "tab-btn"} 
            onClick={() => setTab("stopwatch")}
          >
            <span className="tab-icon">⏱️</span>
            <span className="tab-label">Stopwatch</span>
          </button>
          <button 
            className={tab === "timer" ? "tab-btn active" : "tab-btn"} 
            onClick={() => setTab("timer")}
          >
            <span className="tab-icon">🍅</span>
            <span className="tab-label">Timer</span>
          </button>
        </nav>
        
        <main className="tab-content">
          {tab === "clock" && <Clock />}
          {tab === "alarm" && <Alarm />}
          {tab === "stopwatch" && <Stopwatch />}
          {tab === "timer" && <Timer />}
        </main>
      </div>
    </div>
  );
}
