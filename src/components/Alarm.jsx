// components/Alarm.jsx
import { useState, useEffect, useRef } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Alarm() {
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem("alarms");
    return saved ? JSON.parse(saved) : [];
  });

  const [newAlarm, setNewAlarm] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [ringingAlarm, setRingingAlarm] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("alarms", JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      const today = daysOfWeek[now.getDay()];

      alarms.forEach((alarm, index) => {
        if (alarm.lastTriggered === currentTime) return;

        if (alarm.time === currentTime && alarm.days.includes(today)) {
          setRingingAlarm(alarm);
          if (audioRef.current) {
            audioRef.current.play();
          }
          const updatedAlarms = [...alarms];
          updatedAlarms[index].lastTriggered = currentTime;
          setAlarms(updatedAlarms);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addAlarm = () => {
    if (newAlarm && selectedDays.length > 0) {
      setAlarms([
        ...alarms,
        {
          id: Date.now(),
          time: newAlarm,
          days: selectedDays,
          active: true,
        },
      ]);
      setNewAlarm("");
      setSelectedDays([]);
    } else {
      alert("Please select both time and at least one day!");
    }
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const toggleAlarm = (id) => {
    setAlarms(
      alarms.map((alarm) =>
        alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
      )
    );
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setRingingAlarm(null);
  };

  return (
    <div className="component">
      <h2>Set Alarm</h2>

      <div className="card">
        <div className="alarm-form">
          <div className="input-group">
            <input
              type="time"
              value={newAlarm}
              onChange={(e) => setNewAlarm(e.target.value)}
              className="time-input"
            />
            <button onClick={addAlarm} className="btn btn-primary">
              Add Alarm
            </button>
          </div>

          <div className="days-selector">
            <p>Repeat on:</p>
            <div className="days-grid">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={`day-btn ${
                    selectedDays.includes(day) ? "selected" : ""
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="alarms-list">
        <h3>Your Alarms</h3>
        {alarms.length === 0 ? (
          <p className="no-alarms">No alarms set</p>
        ) : (
          alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`alarm-item card ${!alarm.active ? "disabled" : ""}`}
            >
              <div className="alarm-time">{alarm.time}</div>
              <div className="alarm-days">{alarm.days.join(", ")}</div>
              <div className="alarm-controls">
                <button
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`btn ${
                    alarm.active ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  <span className="button-icon">
                    {alarm.active ? "🔕" : "🔔"}
                  </span>
                  <span className="button-text">
                    {alarm.active ? "Disable" : "Enable"}
                  </span>
                </button>
                <button
                  onClick={() => deleteAlarm(alarm.id)}
                  className="btn btn-danger"
                >
                  <span className="button-icon">🗑️</span>
                  <span className="button-text">Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <audio ref={audioRef} src="./alarm.mp3" loop />

      {ringingAlarm && (
    

        <div className="ringing-alarm-overlay">
          <div className="ringing-alarm">
            <div className="alarm-header">
              <div className="alarm-icon">⏰</div>
              <h3>Alarm!</h3>
            </div>
            <div className="alarm-details">
              <p className="alarm-time">{ringingAlarm.time}</p>
              <p className="alarm-days">{ringingAlarm.days.join(", ")}</p>
            </div>
            <button onClick={stopAlarm} className="stop-alarm-btn">
              <span className="btn-icon">🔕</span>
              Stop Alarm
            </button>
            <div className="alarm-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}
