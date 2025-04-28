import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ selectedDate, setSelectedDate }) => {
  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "20px", alignItems: "center" }}>
      <div>
        <label>Select a Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMM d, yyyy"
          maxDate={new Date()}
          customInput={
            <input
              style={{
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                padding: "5px",
                borderRadius: "5px",
                marginLeft: "10px"
              }}
            />
          }
        />
      </div>
    </div>
  );
};

export default DateSelector;
