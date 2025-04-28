import React from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ open, onToggle, onLogout }) => {
  return (
    <div style={{
      width: open ? "250px" : "50px",
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
        {open && <h3>Menu</h3>}
        <FaBars onClick={onToggle} style={{ cursor: "pointer" }} />
      </div>

      {open && (
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
  );
};

export default Sidebar;
