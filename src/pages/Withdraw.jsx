import "@/styles/Dashboard/withdrawStyle.css";
import { AlertCircle, ArrowLeft, Loader, TrendingDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, withdrawMoney } from "../services/dashboard";
import { toast } from "react-toastify";

function Withdraw() {
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

    const withdrawAmount = parseFloat(amount);

    if (!amount || isNaN(withdrawAmount)) {
  toast.error("Please enter a valid amount");
      return;
    }

    if (withdrawAmount <= 0) {
  toast.error("Amount must be greater than zero");
      return;
    }

    if (withdrawAmount > user.balance) {
  toast.error("Insufficient balance for this withdrawal");
      return;
    }

    if (withdrawAmount > 50000) {
  toast.error("Maximum withdrawal amount is 50,000 ILS per transaction");
      return;
    }

    try {
      setLoading(true);
      await withdrawMoney(withdrawAmount, currency);
  toast.success(`Withdrawal of ${withdrawAmount} ${currency} successful!`);
      setAmount("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to withdraw money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleQuickAmount = (value) => {
    if (value <= user.balance) {
      setAmount(value.toString());
      setError("");
    } else {
      setError("Insufficient balance for this amount");
    }
  };

  const handleMaxWithdraw = () => {
    const maxAmount = Math.min(user.balance, 50000);
    setAmount(maxAmount.toString());
    setError("");
  };

  return (
    <div className="withdraw-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="withdraw-container">
        <div className="withdraw-card">
          <div className="card-icon withdraw-icon">
            <TrendingDown size={32} />
          </div>

          <h1 className="card-title">Withdraw Money</h1>
          <p className="card-subtitle">Withdraw funds from your account</p>

          <div className="current-balance withdraw-balance">
            <span className="balance-label">Available Balance</span>
            <span className="balance-amount">
              {user.balance.toFixed(2)} {currency}
            </span>
          </div>

          {user.balance === 0 && (
            <div className="alert alert-warning">
              <AlertCircle size={18} />
              <p>Your account balance is zero. Please deposit money first.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="withdraw-form">
            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Withdrawal Amount
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
                  disabled={loading || user.balance === 0}
                  step="0.01"
                  min="0"
                  max={user.balance}
                />
                <span className="input-currency">{currency}</span>
              </div>
              <button
                type="button"
                className="max-button"
                onClick={handleMaxWithdraw}
                disabled={loading || user.balance === 0}
              >
                Max: {Math.min(user.balance, 50000).toFixed(2)} {currency}
              </button>
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
                    } ${value > user.balance ? "disabled" : ""}`}
                    onClick={() => handleQuickAmount(value)}
                    disabled={
                      loading || value > user.balance || user.balance === 0
                    }
                  >
                    {value} {currency}
                  </button>
                ))}
              </div>
            </div>

            {amount &&
              !isNaN(parseFloat(amount)) &&
              parseFloat(amount) > 0 &&
              parseFloat(amount) <= user.balance && (
                <div className="balance-preview">
                  <div className="preview-row">
                    <span>Current Balance:</span>
                    <span>
                      {user.balance.toFixed(2)} {currency}
                    </span>
                  </div>
                  <div className="preview-row withdraw-row">
                    <span>Withdrawal Amount:</span>
                    <span>
                      -{parseFloat(amount).toFixed(2)} {currency}
                    </span>
                  </div>
                  <div className="preview-divider"></div>
                  <div className="preview-row total-row">
                    <span>Remaining Balance:</span>
                    <span>
                      {(user.balance - parseFloat(amount)).toFixed(2)}{" "}
                      {currency}
                    </span>
                  </div>
                </div>
              )}

            <button
              type="submit"
              className="submit-button withdraw-button"
              disabled={loading || !amount || user.balance === 0}
            >
              {loading ? (
                <>
                  <Loader size={20} className="spinner-icon" />
                  Processing...
                </>
              ) : (
                <>
                  <TrendingDown size={20} />
                  Withdraw Money
                </>
              )}
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3 className="info-title">Withdrawal Information</h3>
          <ul className="info-list">
            <li>Minimum withdrawal: 1 {currency}</li>
            <li>Maximum withdrawal: 50,000 {currency} per transaction</li>
            <li>Instant processing</li>
            <li>Withdrawals are subject to available balance</li>
            <li>All transactions are secure and encrypted</li>
            <li>Transaction history is updated automatically</li>
          </ul>

          <div className="info-tip">
            <AlertCircle size={18} />
            <div>
              <p className="tip-title">Important</p>
              <p className="tip-text">
                Make sure you have sufficient balance before making a
                withdrawal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
