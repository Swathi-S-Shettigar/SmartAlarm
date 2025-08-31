// components/Stopwatch.jsx
import { useState, useRef } from "react";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
  };

  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const recordLap = () => {
    setLaps([...laps, time]);
  };

  const formatTime = (time) => {
    const milliseconds = `0${Math.floor((time % 1000) / 10)}`.slice(-2);
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor((time / 60000) % 60)}`.slice(-2);
    const hours = `0${Math.floor(time / 3600000)}`.slice(-2);

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="component">
      <h2> Stopwatch</h2>

      <div className="card">
        <div className="time-display">{formatTime(time)}</div>

        <div className="controls">
          {!isRunning && time === 0 && (
            <button onClick={startStopwatch} className="btn btn-primary">
              Start
            </button>
          )}
          {isRunning && (
            <>
              <button onClick={pauseStopwatch} className="btn btn-secondary">
                Pause
              </button>
              <button onClick={recordLap} className="btn btn-primary">
                Lap
              </button>
            </>
          )}
          {!isRunning && time > 0 && (
            <>
              <button onClick={startStopwatch} className="btn btn-primary">
                Resume
              </button>
              <button onClick={resetStopwatch} className="btn btn-danger">
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {laps.length > 0 && (
        <div className="laps-list">
          <h3>Laps</h3>
          {laps.map((lap, index) => (
            <div key={index} className="lap-item card">
              <span className="lap-number">Lap {index + 1}</span>
              <span className="lap-time">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
