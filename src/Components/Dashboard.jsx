import React, { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import DateSelector from "./DateSelector";
import StatsCards from "./StatsCards";
import WeeklyLineChart from "./WeeklyLineChart";
import SentimentPieChart from "./SentimentPieChart";
import CallTable from "./CallTable";
import NoDataMessage from "./NoDataMessage";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

import {
  fetchDailyData,
  fetchWeeklyData,
} from "../api/api";
import { COLORS, SENTIMENT_LABELS } from "../constants/constants";

const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [summaryStats, setSummaryStats] = useState({
    totalCalls: 0,
    totalDuration: "0 minutes",
    neutral: 0,
    positive: 0,
    negative: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState([]);
  const [callData, setCallData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { summaryData, detailsData } = await fetchDailyData(selectedDate);
        const weeklyData = await fetchWeeklyData();

        setSummaryStats({
          totalCalls: summaryData.total_calls || 0,
          totalDuration: summaryData.total_duration || "0 minutes",
          neutral: summaryData.sentiment_breakdown?.Neutral || 0,
          positive: summaryData.sentiment_breakdown?.Positive || 0,
          negative: summaryData.sentiment_breakdown?.Negative || 0,
        });

        setCallData(Array.isArray(detailsData) ? detailsData : [detailsData]);
        setWeeklyStats(weeklyData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
        setSummaryStats({
          totalCalls: 0,
          totalDuration: "0 minutes",
          neutral: 0,
          positive: 0,
          negative: 0,
        });
        setCallData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedDate]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const sentimentData = [
    { name: SENTIMENT_LABELS.positive, value: summaryStats.positive },
    { name: SENTIMENT_LABELS.neutral, value: summaryStats.neutral },
    { name: SENTIMENT_LABELS.negative, value: summaryStats.negative },
  ];

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Sidebar open={sidebarOpen} onToggle={toggleSidebar} onLogout={onLogout} />

      <div style={{ flex: 1, padding: "clamp(10px, 4vw, 30px)" }}>
        <h1 style={{ fontSize: "clamp(20px, 5vw, 36px)" }}>Call Analytics Dashboard</h1>

        <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}

        {(summaryStats.totalCalls > 0 || loading) && <StatsCards summaryStats={summaryStats} />}

        {summaryStats.totalCalls > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {weeklyStats.length > 0 && <WeeklyLineChart weeklyStats={weeklyStats} />}
            {summaryStats.totalCalls > 0 && <SentimentPieChart sentimentData={sentimentData} />}
          </div>
        ) : (
          !loading && !error && <NoDataMessage date={selectedDate} />
        )}

        {callData.length > 0 && <CallTable callData={callData} />}
      </div>
    </div>
  );
};

export default Dashboard;
