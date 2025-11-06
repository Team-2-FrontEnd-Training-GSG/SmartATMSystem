import "@/styles/Dashboard/notFoundStyle.css";
import { ArrowLeft, Compass, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="nf-wrap">
      <div className="nf-card">
        <div className="nf-icon">
          <Compass size={36} />
        </div>

        <h1 className="nf-title">Oops! Page not found</h1>
        <p className="nf-sub">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="nf-actions">
          <button
            className="nf-btn nf-btn-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>

          <Link to="/dashboard" className="nf-btn nf-btn-primary">
            <Home size={18} />
            <span>Go Home</span>
          </Link>
        </div>

        <div className="nf-divider" />

        <div className="nf-quick">
          <p className="nf-quick-title">Quick links</p>
          <div className="nf-links">
            <Link to="/dashboard" className="nf-link">
              Dashboard
            </Link>
            <Link to="/dashboard/deposit" className="nf-link">
              Deposit
            </Link>
            <Link to="/dashboard/withdraw" className="nf-link">
              Withdraw
            </Link>
            <Link to="/dashboard/history" className="nf-link">
              History
            </Link>
            <Link to="/dashboard/watchlist" className="nf-link">
              Watchlist
            </Link>
            <Link to="/dashboard/settings" className="nf-link">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
