import React, { useState } from "react";
import { tableCellStyle } from "../styles/styles";

const TranscriptionRow = ({ transcription, transcriptionClean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <tr>
        <td colSpan="9" style={{ ...tableCellStyle, backgroundColor: "#2A2A2A" }}>
          <div style={{ padding: "10px" }}>
            <h4>Call Transcription:</h4>
            {/* Show cleaned transcription */}
            <div style={{ fontStyle: "italic", whiteSpace: "pre-line", textAlign: "left" }}>
              {transcriptionClean || "Not Available. Please contact admin..."}
            </div>

            {/* Button to open modal */}
            {(transcription || transcriptionClean) && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={openModal}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Full Transcription
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: "#1F1F1F",
            padding: "30px",
            borderRadius: "8px",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "80vh",
            overflowY: "auto",
            color: "#fff",
          }}>
            <h2>Transcription With Speaker Labels (Beta Version)</h2>
            <div style={{ margin: "20px 0", whiteSpace: "pre-line", textAlign: "left", fontStyle: "italic" }}>
              {transcription || "No transcription available."}
            </div>
            <button
              onClick={closeModal}
              style={{
                padding: "8px 16px",
                backgroundColor: "#F44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TranscriptionRow;
