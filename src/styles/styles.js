export const loginStyles = {
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
  
  export const statBoxStyle = {
    backgroundColor: "#1F1F1F",
    padding: "20px",
    borderRadius: "5px",
    textAlign: "center",
  };
  
  export const statValueStyle = {
    fontSize: "1.5em",
    fontWeight: "bold",
  };
  
  export const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#1F1F1F",
  };
  
  export const tableHeaderStyle = {
    backgroundColor: "#333",
    color: "white",
    padding: "12px",
    border: "1px solid #444",
    textAlign: "left",
  };
  
  export const tableCellStyle = {
    padding: "10px",
    border: "1px solid #444",
  };
  
  export const viewMoreButtonStyle = {
    background: "none",
    border: "none",
    color: "#4CAF50",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };
  
  export const noDataStyles = {
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
  
  export const loadingStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100px",
    backgroundColor: "#1F1F1F",
    borderRadius: "10px",
    margin: "20px 0",
  };
  
  export const errorStyles = {
    backgroundColor: "#2A1F1F",
    color: "#fff",
    padding: "15px",
    borderRadius: "5px",
    margin: "20px 0",
  };
  // Existing loadingStyles stays same

export const dotsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };
  
  export const dot1Style = {
    width: "15px",
    height: "15px",
    backgroundColor: "#4CAF50", // Green (first dot)
    borderRadius: "50%",
    animation: "bounce 1.2s infinite ease-in-out",
  };
  
  export const dot2Style = {
    width: "15px",
    height: "15px",
    backgroundColor: "#00C49F", // Light Blue (second dot)
    borderRadius: "50%",
    animation: "bounce 1.2s infinite ease-in-out",
  };
  
  export const dot3Style = {
    width: "15px",
    height: "15px",
    backgroundColor: "#FF8042", // Orange (third dot)
    borderRadius: "50%",
    animation: "bounce 1.2s infinite ease-in-out",
  };
  
  // Insert bounce animation globally if not already inserted
  if (typeof document !== "undefined") {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
        } 
        40% {
          transform: scale(1);
        }
      }
    `, styleSheet.cssRules.length);
  }
  