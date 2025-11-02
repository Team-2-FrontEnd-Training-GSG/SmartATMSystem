import { login } from "@/services/auth";
import { saveUser } from "@/services/storage";
import styles from "@/styles/auth/loginStyle";
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>🏦 Smart ATM Login</h2>
        <p style={{ color: "#6c757d", marginBottom: "30px" }}>
          Please insert your credentials to proceed.
        </p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Account Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="******"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Continue to Dashboard
          </button>
        </form>

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <div style={styles.link}>
          <p>Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              ...styles.button,
              backgroundColor: "#6c757d",
              marginTop: "10px",
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
