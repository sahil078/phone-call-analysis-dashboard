import React, { useState } from "react";
import {
  tableStyle,
  tableHeaderStyle,
  tableCellStyle,
  viewMoreButtonStyle,
} from "../styles/styles";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import TranscriptionRow from "./TranscriptionRow";
import { fetchTranscription } from "../api/api";

const CallTable = ({ callData, expandedRows, toggleRowExpand, selectedDate }) => {
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [transcriptions, setTranscriptions] = useState({});
  const [loadingTranscriptions, setLoadingTranscriptions] = useState({});

  const handleExpandRow = async (index, callId) => {
    toggleRowExpand(index, callId);

    if (!expandedRows[index] && !transcriptions[index]) {
      try {
        setLoadingTranscriptions(prev => ({ ...prev, [index]: true }));

        const { transcription, transcriptionClean } = await fetchTranscription(selectedDate, callId);

        setTranscriptions(prev => ({
          ...prev,
          [index]: { transcription, transcriptionClean }
        }));
      } catch (error) {
        console.error("Error fetching transcription:", error);
        setTranscriptions(prev => ({
          ...prev,
          [index]: {
            transcription: "Error loading transcription.",
            transcriptionClean: null
          }
        }));
      } finally {
        setLoadingTranscriptions(prev => ({ ...prev, [index]: false }));
      }
    }
  };

  const filteredData = callData.filter(item => {
    if (sentimentFilter === "All") return true;
    return item.sentiment_of_call === sentimentFilter;
  });

  return (
    <div style={{ marginTop: "60px", overflowX: "auto", width: "100%" }}>
      <h2>Call Details</h2>

      {/* Filter */}
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label htmlFor="sentimentFilter" style={{ color: "#fff" }}>
          Filter by Sentiment:
        </label>
        <select
          id="sentimentFilter"
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "5px",
            backgroundColor: "#1F1F1F",
            color: "#fff",
            border: "1px solid #444",
          }}
        >
          <option value="All">All</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>
      </div>

      {/* Table */}
      <table style={{ ...tableStyle, fontSize: "clamp(12px, 2.5vw, 14px)" }}>
        <thead>
          <tr style={{ backgroundColor: "#333" }}>
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
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <React.Fragment key={`call-${index}`}>
                <tr>
                  <td style={tableCellStyle}>{item.date || "N/A"}</td>
                  <td style={tableCellStyle}>{item.outgoing_or_incoming || "N/A"}</td>
                  <td style={tableCellStyle}>{item.customer_name_or_number || "N/A"}</td>
                  <td style={tableCellStyle}>{item.branch_name || "N/A"}</td>
                  <td style={tableCellStyle}>{item.phone_number_of_caller || "N/A"}</td>
                  <td style={tableCellStyle}>{item.summary_of_call || "N/A"}</td>
                  <td style={tableCellStyle}>{item.sentiment_of_call || "N/A"}</td>
                  <td style={tableCellStyle}>{item.duration_of_call || "N/A"}</td>
                  <td style={tableCellStyle}>
                    <button
                      onClick={() => handleExpandRow(index, item.id)}
                      style={viewMoreButtonStyle}
                    >
                      {expandedRows[index] ? <><FaChevronUp /> View Less</> : <><FaChevronDown /> View More</>}
                    </button>
                  </td>
                </tr>

                {expandedRows[index] && (
                  <TranscriptionRow
                    transcription={transcriptions[index]?.transcription}
                    transcriptionClean={transcriptions[index]?.transcriptionClean}
                  />
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ ...tableCellStyle, textAlign: "center" }}>
                No calls matching the selected sentiment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CallTable;
