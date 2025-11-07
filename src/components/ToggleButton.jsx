import { useTheme } from "../contexts/ThemeContext";
import "../styles/Dashboard/ToggleButton.css";

export default function ToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`toggle-btn ${theme === "dark" ? "is-dark" : "is-light"}`}
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <span className="toggle-inner" aria-hidden>
        <span className="toggle-handle">{theme === "light" ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}
