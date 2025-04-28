import React from "react";
import { errorStyles } from "../styles/styles";

const ErrorMessage = ({ message }) => {
  return (
    <div style={errorStyles}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
