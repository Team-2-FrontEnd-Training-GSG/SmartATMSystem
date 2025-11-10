import { useEffect, useState } from "react";

import "@/styles/Dashboard/dashboardStyle.css";

export default function BirthdayPopup({ user }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Only show once per session
    const shown = sessionStorage.getItem("birthdayModalShown");
    if (shown) return;

    // support multiple possible field names for birth date
    const birthRaw =
      user.birthday || user.birth_date || user.birthDate || user.birth;
    if (!birthRaw) return;

    // Parse YYYY-MM-DD safely (avoid timezone shifts) or fall back to Date
    let birth;
    const isoMatch = /^\d{4}-\d{2}-\d{2}$/.test(birthRaw);
    if (isoMatch) {
      const [y, m, d] = birthRaw.split("-").map(Number);
      birth = new Date(y, m - 1, d);
    } else {
      birth = new Date(birthRaw);
    }
    if (isNaN(birth.getTime())) return;

    const today = new Date();
    if (
      today.getDate() === birth.getDate() &&
      today.getMonth() === birth.getMonth()
    ) {
      setVisible(true);
      // mark shown so it doesn't reappear during this session
      sessionStorage.setItem("birthdayModalShown", "true");
    }
  }, [user]);

  if (!visible) return null;

  return (
    <div className="birthday-overlay">
      <div className="birthday-popup" role="dialog" aria-modal="true">
        <div className="birthday-icon">🎉</div>
        <h3 className="birthday-title">
          🎉 Happy Birthday, {user.first_name}! 🎂
        </h3>
        <p className="birthday-message">
          Wishing you a wonderful day filled with joy.
        </p>
        <div>
          <button className="birthday-button" onClick={() => setVisible(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
