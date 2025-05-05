import React, { useState, useEffect } from "react";
import {
  tableStyle,
  tableHeaderStyle,
  tableCellStyle,
  viewMoreButtonStyle,
} from "../styles/styles";
import { FaEye } from "react-icons/fa";
import TranscriptionRow from "./TranscriptionRow";
import "../styles/CallTable.css";

const CallTable = ({ callData }) => {
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [selectedTranscription, setSelectedTranscription] = useState(null);

  // Reset sentiment filter to "all" when callData (date) changes
  useEffect(() => {
    setSentimentFilter("all");
  }, [callData]);

  // Fixed dropdown options
  const sentimentOptions = ["all", "positive", "neutral", "negative"];

  // Filter call data based on sentiment
  const filteredData = callData.filter(item => {
    if (sentimentFilter === "all") return true;
    const itemSentiment = (item.sentiment_of_call || "").trim().toLowerCase();
    return itemSentiment === sentimentFilter;
  });

  return (
    <div className="call-table-container">
      <h2>Call Details</h2>

      {/* Sentiment Filter */}
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
          {sentimentOptions.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
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
            <th style={tableHeaderStyle}>Transcription</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={`call-${index}`}>
                <td style={tableCellStyle}>{item.date || "N/A"}</td>
                <td style={tableCellStyle}>{item.outgoing_or_incoming || "N/A"}</td>
                <td style={tableCellStyle}>{item.customer_name_or_number || "N/A"}</td>
                <td style={tableCellStyle}>{item.branch_name || "N/A"}</td>
                <td style={tableCellStyle}>{item.phone_number_of_caller || "N/A"}</td>
                <td style={tableCellStyle}>{item.summary_of_call || "N/A"}</td>
                <td style={tableCellStyle}>{(item.sentiment_of_call || "N/A").trim().toLowerCase()}</td>
                <td style={tableCellStyle}>{item.duration_of_call || "N/A"}</td>
                <td style={tableCellStyle}>
                  <button
                    onClick={() =>
                      setSelectedTranscription({
                        transcription: item.transcription || "N/A",
                        transcriptionClean: item.transcription_clean || "N/A",
                      })
                    }
                    style={viewMoreButtonStyle}
                  >
                    <FaEye style={{ marginRight: "5px" }} />
                    View
                  </button>
                </td>
              </tr>
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

      {selectedTranscription && (
        <TranscriptionRow
          transcription={selectedTranscription.transcription}
          transcriptionClean={selectedTranscription.transcriptionClean}
          onClose={() => setSelectedTranscription(null)}
        />
      )}
    </div>
  );
};

export default CallTable;
