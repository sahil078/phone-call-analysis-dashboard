import React, { useState } from "react";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  return (
    <div>
      {!isLoggedIn ? <Login onLogin={handleLogin} /> : <Dashboard onLogout={handleLogout} />}
    </div>
  );
};

export default App;
