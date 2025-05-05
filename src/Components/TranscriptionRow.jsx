import React from "react";
import "../styles/TranscriptionModal.css";

const TranscriptionRow = ({ transcription, transcriptionClean, onClose }) => {
  return (
    <div className="transcription-modal-overlay">
      <div className="transcription-modal-content">
        <h2>Transcription With Speaker Labels (Beta Version)</h2>

        <div className="transcription-row-container">
          <div className="transcription-box">
            <div className="transcription-title">Cleaned Transcription:</div>
            {transcriptionClean || "Not Available. Please contact admin..."}
          </div>

          <div className="transcription-box">
            <div className="transcription-title">Raw Transcription:</div>
            {transcription || "No transcription available."}
          </div>
        </div>

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default TranscriptionRow;
