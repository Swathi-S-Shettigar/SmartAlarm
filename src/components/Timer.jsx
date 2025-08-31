// components/Timer.jsx
import { useState, useRef, useEffect } from "react";

export default function Timer() {
  const [inputMinutes, setInputMinutes] = useState(0);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (!isRunning && (inputMinutes > 0 || inputSeconds > 0)) {
      setIsRunning(true);
      const totalSeconds = inputMinutes * 60 + inputSeconds;
      setTimeLeft(totalSeconds);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            const audio = new Audio(
              "./alarm_clock.ogg"
            );
            audio.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTimeLeft(0);
    setInputMinutes(0);
    setInputSeconds(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = () => {
    const total = inputMinutes * 60 + inputSeconds;
    if (total === 0) return 0;
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="component">
      <h2> Timer</h2>

      <div className="card">
        {!isRunning && timeLeft === 0 && (
          <div className="input-group">
            <input
              type="number"
              min="0"
              max="59"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Number(e.target.value))}
              placeholder="Min"
            />
            <span>:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(Number(e.target.value))}
              placeholder="Sec"
            />
          </div>
        )}

        <div className="time-display">{formatTime(timeLeft)}</div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress()}%` }}
          ></div>
        </div>

        <div className="controls">
          {!isRunning && timeLeft === 0 && (
            <button onClick={startTimer} className="btn btn-primary">
              Start
            </button>
          )}
          {isRunning && (
            <button onClick={pauseTimer} className="btn btn-secondary">
              Pause
            </button>
          )}
          {!isRunning && timeLeft > 0 && (
            <button onClick={startTimer} className="btn btn-primary">
              Resume
            </button>
          )}
          {(timeLeft > 0 || inputMinutes > 0 || inputSeconds > 0) && (
            <button onClick={resetTimer} className="btn btn-danger">
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
