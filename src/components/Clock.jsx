import { useState, useEffect, useRef } from "react";

export default function Clock() {
  const [timezones, setTimezones] = useState([]);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedClocks, setSavedClocks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load saved clocks from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedClocks");
    if (saved) {
      setSavedClocks(JSON.parse(saved));
    }
  }, []);

  // Save clocks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedClocks", JSON.stringify(savedClocks));
  }, [savedClocks]);

  // Fetch timezones from API
  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://worldtimeapi.org/api/timezone");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTimezones(data);
      } catch (err) {
        console.error("Error fetching timezones:", err);
        setError("Failed to fetch timezone data. Using default timezones.");
        // Set default timezones as fallback
        setTimezones([
          "Asia/Kolkata",
          "America/New_York",
          "Europe/London",
          "Asia/Tokyo",
          "Australia/Sydney",
          "Europe/Paris",
          "Africa/Cairo",
          "America/Los_Angeles",
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimezones();
  }, []);

  // Update time for the selected timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeOptions = {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        };

        const dateOptions = {
          timeZone: timezone,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };

        setTime(new Intl.DateTimeFormat("en-US", timeOptions).format(now));
        setDate(new Intl.DateTimeFormat("en-US", dateOptions).format(now));
      } catch (err) {
        console.error("Invalid timezone:", timezone);
        setError("Invalid timezone selected. Please choose another.");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Format timezone label for display
  const formatLabel = (zone) => {
    const parts = zone.split("/");
    if (parts.length === 2) {
      return `${parts[0]} (${parts[1].replace(/_/g, " ")})`;
    }
    return zone;
  };

  // Filter timezones based on search query
  const filteredTimezones = timezones.filter(
    (zone) =>
      zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatLabel(zone).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add a clock to saved clocks
  const addClock = () => {
    if (timezone && !savedClocks.includes(timezone)) {
      setSavedClocks([...savedClocks, timezone]);
    }
  };

  // Remove a clock from saved clocks
  const removeClock = (zoneToRemove) => {
    setSavedClocks(savedClocks.filter((zone) => zone !== zoneToRemove));
  };

  // Set a saved clock as the current timezone
  const setAsCurrent = (zone) => {
    setTimezone(zone);
    setIsDropdownOpen(false);
  };

  // Select a timezone from dropdown
  const selectTimezone = (zone) => {
    setTimezone(zone);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="component">
      <h2>🌍 World Clock</h2>

      <div className="card">
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading timezones...</p>
          </div>
        ) : (
          <>
            <div className="timezone-selector">
              <div className="custom-dropdown" ref={dropdownRef}>
                <div
                  className="dropdown-header"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{formatLabel(timezone)}</span>
                  <span className="dropdown-arrow">
                    {isDropdownOpen ? "▲" : "▼"}
                  </span>
                </div>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search timezones..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        autoFocus
                      />
                    </div>

                    <div className="dropdown-options">
                      {filteredTimezones.length > 0 ? (
                        filteredTimezones.map((zone) => (
                          <div
                            key={zone}
                            className={`dropdown-option ${
                              timezone === zone ? "selected" : ""
                            }`}
                            onClick={() => selectTimezone(zone)}
                          >
                            {formatLabel(zone)}
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-no-results">
                          No timezones found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={addClock}
                className={`add-button ${
                  savedClocks.includes(timezone) ? "disabled" : ""
                }`}
                disabled={savedClocks.includes(timezone)}
                title={
                  savedClocks.includes(timezone)
                    ? "Already saved"
                    : "Add to saved clocks"
                }
              >
                <span className="button-icon">+</span>
                <span className="button-text">Add Clock</span>
              </button>
            </div>

            <div className="time-display">{time}</div>
            <p className="date-display">{date}</p>
          </>
        )}
      </div>

      {/* Saved Clocks Section */}
      {savedClocks.length > 0 && (
        <div className="card">
          <h3>Saved Clocks</h3>
          <div className="saved-clocks">
            {savedClocks.map((zone) => (
              <div key={zone} className="saved-clock-item">
                <div className="saved-clock-info">
                  <span className="saved-clock-name">{formatLabel(zone)}</span>
                  <span className="saved-clock-time">
                    {new Date().toLocaleTimeString("en-US", {
                      timeZone: zone,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <div className="saved-clock-actions">
                  <button
                    onClick={() => setAsCurrent(zone)}
                    className="view-button"
                    title="Set as current time"
                  >
                    <span className="button-icon">👁️</span>
                    <span className="button-text">View</span>
                  </button>
                  <button
                    onClick={() => removeClock(zone)}
                    className="delete-button"
                    title="Remove clock"
                  >
                    <span className="button-icon">×</span>
                    <span className="button-text">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
