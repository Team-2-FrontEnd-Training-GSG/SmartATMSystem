import "@/styles/Dashboard/depositStyle.css";
import { ArrowLeft, Loader, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { depositMoney, getUser } from "../services/dashboard";

function Deposit() {
  const [amount, setAmount] = useState("");
  const [currency] = useState("ILS");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const user = getUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const depositAmount = parseFloat(amount);

    if (!amount || isNaN(depositAmount)) {
      setError("Please enter a valid amount");
      return;
    }

    if (depositAmount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    if (depositAmount > 100000) {
      setError("Maximum deposit amount is 100,000 ILS");
      return;
    }

    try {
      setLoading(true);
      await depositMoney(depositAmount, currency);
      setSuccess(true);
      setAmount("");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to deposit money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setError("");
  };

  return (
    <div className="deposit-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="deposit-container">
        <div className="deposit-card">
          <div className="card-icon">
            <TrendingUp size={32} />
          </div>

          <h1 className="card-title">Deposit Money</h1>
          <p className="card-subtitle">Add funds to your account</p>

          <div className="current-balance">
            <span className="balance-label">Current Balance</span>
            <span className="balance-amount">
              {user.balance.toFixed(2)} {currency}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="deposit-form">
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Deposit Amount
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="amount"
                  className="form-input"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
                <span className="input-currency">{currency}</span>
              </div>
            </div>
            <div className="quick-amounts">
              <p className="quick-amounts-label">Quick amounts</p>
              <div className="quick-amounts-grid">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`quick-amount-btn ${
                      amount === value.toString() ? "active" : ""
                    }`}
                    onClick={() => handleQuickAmount(value)}
                    disabled={loading}
                  >
                    {value} {currency}
                  </button>
                ))}
              </div>
            </div>
            {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
              <div className="balance-preview">
                <div className="preview-row">
                  <span>Current Balance:</span>
                  <span>
                    {user.balance.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="preview-row deposit-row">
                  <span>Deposit Amount:</span>
                  <span>
                    +{parseFloat(amount).toFixed(2)} {currency}
                  </span>
                </div>
                <div className="preview-divider"></div>
                <div className="preview-row total-row">
                  <span>New Balance:</span>
                  <span>
                    {(user.balance + parseFloat(amount)).toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <p>✓ Deposit successful! Redirecting...</p>
              </div>
            )}

            <button
              type="submit"
              className="submit-button deposit-button"
              disabled={loading || !amount}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spinner-icon" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingUp size={20} />
                  Deposit Money
                </>
              )}
            </button>
          </form>
        </div>
        <div className="info-card">
          <h3 className="info-title">Deposit Information</h3>
          <ul className="info-list">
            <li>Minimum deposit: 1 {currency}</li>
            <li>Maximum deposit: 100,000 {currency}</li>
            <li>Instant processing</li>
            <li>All deposits are secure and encrypted</li>
            <li>Transaction history is updated automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Deposit;
