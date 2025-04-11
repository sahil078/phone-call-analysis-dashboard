import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, isWithinInterval, addDays } from "date-fns";
import { FaBars, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin123@gmail.com" && password === "admin@123") {
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={loginStyles.container}>
      <h2 style={loginStyles.heading}>Login</h2>
      {error && <p style={loginStyles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={loginStyles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={loginStyles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={loginStyles.input}
          required
        />
        <button type="submit" style={loginStyles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [callData, setCallData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalCalls: 0,
    totalDuration: "0 minutes",
    neutral: 0,
    positive: 0,
    negative: 0
  });
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [transcriptions, setTranscriptions] = useState({});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const fetchDailyData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Reset expanded rows and transcriptions when date changes
      setExpandedRows({});
      setTranscriptions({});

      const [summaryResponse, detailsResponse] = await Promise.all([

        fetch(`${process.env.REACT_APP_CALL_SUMMARY_API}?date=${formattedDate}`),
        fetch(`${process.env.REACT_APP_CALL_API}?date=${formattedDate}`)
      ]);

      if (!summaryResponse.ok || !detailsResponse.ok) {
        throw new Error("Failed to fetch data. Please try again later.");
      }

      const [summaryData, detailsData] = await Promise.all([
        summaryResponse.json(),
        detailsResponse.json()
      ]);

      if (!summaryData || !detailsData) {
        throw new Error("No data available for the selected date");
      }

      setSummaryStats({
        totalCalls: summaryData.total_calls || 0,
        totalDuration: summaryData.total_duration || "0 minutes",
        neutral: summaryData.sentiment_breakdown?.Neutral || 0,
        positive: summaryData.sentiment_breakdown?.Positive || 0,
        negative: summaryData.sentiment_breakdown?.Negative || 0
      });
      
      setCallData(Array.isArray(detailsData) ? detailsData : [detailsData]);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
      setCallData([]);
      setSummaryStats({
        totalCalls: 0,
        totalDuration: "0 minutes",
        neutral: 0,
        positive: 0,
        negative: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
    const response = await fetch(`${process.env.REACT_APP_WEEKLY_CALL_SUMMARY_API}`);
      if (!response.ok) {
        throw new Error("Failed to fetch weekly data");
      }
      const weeklyData = await response.json();
      const processedData = Array.isArray(weeklyData) ? weeklyData : [weeklyData];
      setWeeklyStats(processedData);
    } catch (err) {
      console.error("Error fetching weekly data:", err);
      setWeeklyStats([]);
    }
  };

  const fetchTranscription = async (callId, index) => {
    if (transcriptions[index]) return; // Already fetched
    
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
     const response = await fetch(`${process.env.REACT_APP_CALL_API}?date=${formattedDate}&call_id=${callId}`);

      
      if (!response.ok) {
        throw new Error("Failed to fetch transcription");
      }
      
      const data = await response.json();
      const callDetails = Array.isArray(data) ? data.find(item => item.call_id === callId) : data;
      
      if (callDetails && callDetails.transcription) {
        setTranscriptions(prev => ({
          ...prev,
          [index]: callDetails.transcription
        }));
      } else {
        setTranscriptions(prev => ({
          ...prev,
          [index]: "No transcription available for this call."
        }));
      }
    } catch (err) {
      console.error("Error fetching transcription:", err);
      setTranscriptions(prev => ({
        ...prev,
        [index]: "Error loading transcription. Please try again."
      }));
    }
  };

  const toggleRowExpand = (index, callId) => {
    if (!expandedRows[index]) {
      fetchTranscription(callId, index);
    }
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    fetchDailyData(selectedDate);
    fetchWeeklyData();
  }, [selectedDate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sentimentData = [
    { name: 'Positive', value: summaryStats.positive },
    { name: 'Neutral', value: summaryStats.neutral },
    { name: 'Negative', value: summaryStats.negative }
  ];

  const NoDataMessage = () => (
    <div style={noDataStyles.container}>
      <div style={noDataStyles.content}>
        <h3>No Calls Recorded</h3>
        <p>There were no calls on {format(selectedDate, 'MMMM d, yyyy')}.</p>
        <p>Try selecting a different date to view call analytics.</p>
        <div style={noDataStyles.icon}>📅</div>
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex",
      backgroundColor: "#121212",
      color: "#fff",
      minHeight: "100vh",
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "250px" : "50px",
        backgroundColor: "#1F1F1F",
        transition: "width 0.3s",
        padding: "20px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          {sidebarOpen && <h3>Menu</h3>}
          <FaBars onClick={toggleSidebar} style={{ cursor: "pointer" }} />
        </div>

        {sidebarOpen && (
          <div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}>Overview</li>
            </ul>
            <button
              onClick={onLogout}
              style={{
                background: "#F44336",
                color: "#fff",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ color: "#fff" }}>Call Analytics Dashboard</h1>

        {/* Date picker */}
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

        {loading && (
          <div style={loadingStyles}>
            <div className="spinner"></div>
            <p>Loading call data...</p>
          </div>
        )}
        
        {error && (
          <div style={errorStyles}>
            <p>No Data available for this date</p>
          </div>
        )}

        {/* Stats Cards - Only show if we have data or loading */}
        {(summaryStats.totalCalls > 0 || loading) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginBottom: "30px" }}>
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
        )}

        {/* Charts Section - Only show if we have data */}
        {summaryStats.totalCalls > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            {/* Weekly Calls Line Chart */}
            {weeklyStats.length > 0 && (
              <div style={{ height: "400px" }}>
                <h2>Weekly Call Trends</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyStats}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="date"
                      stroke="#fff"
                      tick={{ fill: '#fff' }}
                    />
                    <YAxis
                      stroke="#fff"
                      tick={{ fill: '#fff' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#333',
                        borderColor: '#555',
                        color: '#fff'
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        color: '#fff',
                        paddingTop: '20px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total_calls"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Total Calls"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Sentiment Pie Chart */}
            {summaryStats.totalCalls > 0 && (
              <div style={{ height: "400px" }}>
                <h2>Sentiment Breakdown</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#333',
                        borderColor: '#555',
                        color: '#fff'
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        color: '#fff',
                        paddingTop: '20px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : !loading && !error && <NoDataMessage />}

        {/* Call Details Table */}
        {callData.length > 0 && (
          <div style={{ marginTop: '30px', overflowX: 'auto' }}>
            <h2>Call Details</h2>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: '#333' }}>
                  <th style={tableHeaderStyle}>Date</th>
                  <th style={tableHeaderStyle}>Call Type</th>
                  <th style={tableHeaderStyle}>Customer</th>
                  <th style={tableHeaderStyle}>Branch</th>
                  <th style={tableHeaderStyle}>Phone Number</th>
                  <th style={tableHeaderStyle}>Summary</th>
                  <th style={tableHeaderStyle}>Sentiment</th>
                  <th style={tableHeaderStyle}>Duration</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {callData.map((item, index) => (
                  <React.Fragment key={`call-${index}`}>
                    <tr>
                      <td style={tableCellStyle}>{item.Date || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Outgoing_0r_Incoming || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Customer_Name_or_Number || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Branch_Name || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Phone_number_of_caller || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Summary_of_call || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Sentiment_of_call || 'N/A'}</td>
                      <td style={tableCellStyle}>{item.Duration_of_Call || 'N/A'}</td>
                      <td style={tableCellStyle}>
                        <button 
                          onClick={() => toggleRowExpand(index, item.call_id)}
                          style={viewMoreButtonStyle}
                        >
                          {expandedRows[index] ? (
                            <>
                              <FaChevronUp /> View Less
                            </>
                          ) : (
                            <>
                              <FaChevronDown /> View More
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedRows[index] && (
                      <tr>
                        <td colSpan="9" style={{ ...tableCellStyle, backgroundColor: '#2A2A2A' }}>
                          <div style={{ padding: '10px' }}>
                            <h4>Call Transcription:</h4>
                            <p style={{ fontStyle: 'italic' }}>
                              {transcriptions[index] || "Loading transcription..."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const loginStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
  },
  heading: {
    fontSize: "2em",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#333",
    color: "#fff",
  },
  button: {
    padding: "10px",
    margin: "20px 0",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "#F44336",
    marginBottom: "10px",
  },
};

const statBoxStyle = {
  backgroundColor: "#1F1F1F",
  padding: "20px",
  borderRadius: "5px",
  textAlign: "center",
};

const statValueStyle = {
  fontSize: "1.5em",
  fontWeight: "bold",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  backgroundColor: "#1F1F1F",
};

const tableHeaderStyle = {
  backgroundColor: "#333",
  color: "white",
  padding: "12px",
  border: "1px solid #444",
  textAlign: "left",
};

const tableCellStyle = {
  padding: "10px",
  border: "1px solid #444",
};

const viewMoreButtonStyle = {
  background: "none",
  border: "none",
  color: "#4CAF50",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const noDataStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    backgroundColor: "#1F1F1F",
    borderRadius: "10px",
    marginTop: "20px",
  },
  content: {
    textAlign: "center",
    padding: "20px",
  },
  icon: {
    fontSize: "50px",
    marginTop: "20px",
  }
};

const loadingStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100px",
  backgroundColor: "#1F1F1F",
  borderRadius: "10px",
  margin: "20px 0",
};

const errorStyles = {
  backgroundColor: "#2A1F1F",
  color: "#ffff",
  padding: "15px",
  borderRadius: "5px",
  margin: "20px 0",
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;