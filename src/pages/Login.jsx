import { login } from "@/services/auth";
import { saveUser } from "@/services/storage";
import "@/styles/auth/loginStyle.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(username, pin);
    console.log("Login response:", response);
    const validUser = response.find(
      (user) => user.user_name === username && user.pin === pin
    );
    if (validUser) {
      saveUser(validUser);
      navigate("/dashboard");
    } else {
      setError("Invalid username or PIN. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="header">🏦 Smart ATM Login</h2>
        <p style={{ color: "#6c757d", marginBottom: "30px" }}>
          Please insert your credentials to proceed.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Account Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="******"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="button">
            Continue to Dashboard
          </button>
        </form>

        {error && <p className="error">⚠️ {error}</p>}

        <div className="link">
          <p>Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="button secondary-btn"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
