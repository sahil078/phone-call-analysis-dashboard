import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

const WeeklyLineChart = ({ weeklyStats }) => {
  return (
    <div style={{ minHeight: "300px", height: "40vh" }}>
      <h2>Last 7 Day Trends</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weeklyStats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="date"
            stroke="#fff"
            tickFormatter={(str) => {
              const date = new Date(str);
              return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
            }}
            tick={{ fill: '#fff' }}
          />
          <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
          <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555', color: '#fff' }} />
          <Legend wrapperStyle={{ color: '#fff', paddingTop: '20px' }} />
          <Line type="monotone" dataKey="total_calls" stroke="#8884d8" activeDot={{ r: 8 }} name="Total Calls" />
          <Line type="monotone" dataKey="neutral_calls" stroke="#82ca9d" name="Neutral Calls" />
          <Line type="monotone" dataKey="positive_calls" stroke="#00C49F" name="Positive Calls" />
          <Line type="monotone" dataKey="negative_calls" stroke="#FF8042" name="Negative Calls" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyLineChart;
