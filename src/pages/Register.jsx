import { register } from "@/services/auth";
import { saveUser } from "@/services/storage";
import styles from "@/styles/auth/loginStyle"; // reuse same design
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!firstName || !lastName || !username || !pin || !birthday) {
        setError("Please fill in all required fields.");
        return;
      }
      const newUser = {
        id: Date.now(),
        user_name: username,
        first_name: firstName,
        last_name: lastName,
        pin,
        birthday,
        profile_img: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        balance: 0,
        transactions: [],
      };
      await register(newUser);
      saveUser(newUser);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>📝 Create New Account</h2>
        <p style={{ color: "#6c757d", marginBottom: "30px" }}>
          Please fill in your details to create an account.
        </p>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="PIN (e.g. 1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <div style={styles.link}>
          <p>Already have an account?</p>
          <button
            onClick={() => navigate("/login")}
            style={{
              ...styles.button,
              backgroundColor: "#6c757d",
              marginTop: "10px",
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
