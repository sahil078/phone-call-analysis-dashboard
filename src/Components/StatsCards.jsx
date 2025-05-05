import React from "react";
import { statBoxStyle, statValueStyle } from "../styles/styles";

const StatsCards = ({ summaryStats }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "20px",
      marginBottom: "30px",
    }}>
      <div style={statBoxStyle}>
        <h3>Total Calls</h3>
        <div style={statValueStyle}>{summaryStats.totalCalls}</div>
      </div>
      <div style={statBoxStyle}>
        <h3>Total Duration</h3>
        <div style={statValueStyle}>{summaryStats.totalDuration}</div>
      </div>
      <div style={statBoxStyle}>
        <h3>Positive</h3>
        <div style={statValueStyle}>{summaryStats.positive}</div>
      </div>
      <div style={statBoxStyle}>
        <h3>Neutral</h3>
        <div style={statValueStyle}>{summaryStats.neutral}</div>
      </div>
      <div style={statBoxStyle}>
        <h3>Negative</h3>
        <div style={statValueStyle}>{summaryStats.negative}</div>
      </div>
    </div>
  );
};

export default StatsCards;
