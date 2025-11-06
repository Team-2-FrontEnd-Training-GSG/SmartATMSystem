import "@/styles/Dashboard/watchlistStyle.css";
import { ArrowLeft, Star, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle, remove, clear } from "@/store/watchlist/watchlistSlice";
import { CURRENCIES } from "@/constants/currencies";

function Watchlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const watchlist = useSelector((s) => s.watchlist.items);

  const allCurrencies = Object.entries(CURRENCIES);
  const inWatchlist = allCurrencies.filter(([code]) =>
    watchlist.includes(code)
  );

  const handleToggle = (code) => dispatch(toggle(code));
  const handleRemove = (code) => dispatch(remove(code));
  const handleClear = () => dispatch(clear());

  return (
    <div className="watchlist-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="watchlist-container">
        <div className="watchlist-card">
          <h1 className="card-title">Currencies</h1>
          <p className="card-subtitle">Add currencies to your watchlist</p>

          <div className="currency-list">
            {allCurrencies.map(([code, rate]) => {
              const isFav = watchlist.includes(code);
              return (
                <div
                  key={code}
                  className={`currency-row ${isFav ? "active" : ""}`}
                >
                  <div className="currency-info">
                    <span className="currency-code">{code}</span>
                    <span className="currency-rate">{rate.toFixed(2)} ILS</span>
                  </div>
                  <button
                    className={`star-button ${isFav ? "star-active" : ""}`}
                    onClick={() => handleToggle(code)}
                    aria-label={
                      isFav ? "Remove from watchlist" : "Add to watchlist"
                    }
                    title={isFav ? "Remove from watchlist" : "Add to watchlist"}
                  >
                    {isFav ? <Star size={18} /> : <StarOff size={18} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="watchlist-card secondary">
          <div className="card-header-row">
            <h2 className="card-title">Your Watchlist</h2>
            {watchlist.length > 0 && (
              <button className="clear-button" onClick={handleClear}>
                Clear
              </button>
            )}
          </div>

          {inWatchlist.length === 0 ? (
            <div className="empty-state">
              <p>No currencies in your watchlist yet.</p>
              <p className="helper">Use the ⭐ button to add some.</p>
            </div>
          ) : (
            <div className="currency-list">
              {inWatchlist.map(([code, rate]) => (
                <div key={code} className="currency-row">
                  <div className="currency-info">
                    <span className="currency-code">{code}</span>
                    <span className="currency-rate">{rate.toFixed(2)} ILS</span>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(code)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
