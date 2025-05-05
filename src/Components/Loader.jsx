import React from "react";
import { loadingStyles, dotsContainerStyle, dot1Style, dot2Style, dot3Style } from "../styles/styles";

const Loader = () => {
  return (
    <div style={loadingStyles}>
      <div style={dotsContainerStyle}>
        <div style={{ ...dot1Style, animationDelay: "0s" }}></div>
        <div style={{ ...dot2Style, animationDelay: "0.2s" }}></div>
        <div style={{ ...dot3Style, animationDelay: "0.4s" }}></div>
      </div>
      <p style={{ marginTop: "20px", color: "#aaa" }}>Loading call data...</p>
    </div>
  );
};

export default Loader;
