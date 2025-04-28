import React, { useState } from "react";
import { loginStyles } from "../styles/styles";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin123@gmail.com" && password === "admin@123") {
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={loginStyles.container}>
      <h2 style={loginStyles.heading}>Login</h2>
      {error && <p style={loginStyles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={loginStyles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={loginStyles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={loginStyles.input}
          required
        />
        <button type="submit" style={loginStyles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
