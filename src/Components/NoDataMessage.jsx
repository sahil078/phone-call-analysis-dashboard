import React from "react";
import { format } from "date-fns";
import { noDataStyles } from "../styles/styles";

const NoDataMessage = ({ date }) => {
  return (
    <div style={noDataStyles.container}>
      <div style={noDataStyles.content}>
        <h3>No Calls Recorded</h3>
        <p>There were no calls on {format(date, 'MMMM d, yyyy')}.</p>
        <p>Try selecting a different date to view call analytics.</p>
        <div style={noDataStyles.icon}>📅</div>
      </div>
    </div>
  );
};

export default NoDataMessage;
