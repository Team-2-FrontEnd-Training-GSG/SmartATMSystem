import { getUser } from "@/services/storage";
import "@/styles/Dashboard/dashboardHomeStyle.css";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ToggleButton from "@/components/ToggleButton";

function DashboardHome() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await getUser();
      setUserData(data);
      setError(null);
        toast.success("Dashboard data loaded successfully");
    } catch (err) {
      setError("Failed to load user data. Please try again.");
      toast.error("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchUserData} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  if (!userData) {
    return null;
  }
  const totalDeposits = userData.transactions
    .filter((t) => t.type === "Deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = userData.transactions
    .filter((t) => t.type === "Withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTransfers = userData.transactions
    .filter((t) => t.type === "Transfer")
    .reduce((sum, t) => sum + t.amount, 0);

  const recentTransactions = userData.transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const balanceStatus =
    userData.balance > 0
      ? "positive"
      : userData.balance === 0
      ? "zero"
      : "negative";

  const monthlyData = {};
  userData.transactions.forEach((transaction) => {
    const month = new Date(transaction.date).toLocaleString("default", {
      month: "short",
    });
    if (!monthlyData[month]) {
      monthlyData[month] = { deposits: 0, withdrawals: 0 };
    }
    if (transaction.type === "Deposit") {
      monthlyData[month].deposits += transaction.amount;
    } else if (transaction.type === "Withdraw") {
      monthlyData[month].withdrawals += transaction.amount;
    }
  });

  const getTransactionIcon = (type) => {
    switch (type) {
      case "Deposit":
        return <TrendingUp size={18} className="transaction-icon deposit" />;
      case "Withdraw":
        return <TrendingDown size={18} className="transaction-icon withdraw" />;
      case "Transfer":
        return <ArrowUpRight size={18} className="transaction-icon transfer" />;
      default:
        return <DollarSign size={18} className="transaction-icon" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dashboard-home">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1 className="welcome-title">
            Welcome back, {userData.first_name}! 👋
          </h1>
          <p className="welcome-subtitle">
            Here's what's happening with your account today
          </p>
        </div>
        <div className="welcome-toggle">
          <ToggleButton />
        </div>
      </div>

      <div className="stats-grid">
        <div className={`stat-card balance-card ${balanceStatus}`}>
          <div className="stat-header">
            <div className="stat-icon-wrapper balance-icon">
              <Wallet size={24} />
            </div>
            <span className="stat-label">Current Balance</span>
          </div>
          <div className="stat-value">
            {userData.balance.toFixed(2)}{" "}
            {userData.transactions[0]?.currency || "ILS"}
          </div>
          <div className={`balance-status ${balanceStatus}`}>
            {balanceStatus === "positive" && "● Healthy Balance"}
            {balanceStatus === "zero" && "● Zero Balance"}
            {balanceStatus === "negative" && "● Negative Balance"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper deposit-icon">
              <ArrowDownRight size={24} />
            </div>
            <span className="stat-label">Total Deposits</span>
          </div>
          <div className="stat-value">{totalDeposits.toFixed(2)} ILS</div>
          <p className="stat-description">
            {userData.transactions.filter((t) => t.type === "Deposit").length}{" "}
            transactions
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper withdraw-icon">
              <ArrowUpRight size={24} />
            </div>
            <span className="stat-label">Total Withdrawals</span>
          </div>
          <div className="stat-value">{totalWithdrawals.toFixed(2)} ILS</div>
          <p className="stat-description">
            {userData.transactions.filter((t) => t.type === "Withdraw").length}{" "}
            transactions
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon-wrapper transfer-icon">
              <TrendingUp size={24} />
            </div>
            <span className="stat-label">Total Transfers</span>
          </div>
          <div className="stat-value">{totalTransfers.toFixed(2)} ILS</div>
          <p className="stat-description">
            {userData.transactions.filter((t) => t.type === "Transfer").length}{" "}
            transactions
          </p>
        </div>
      </div>
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button
            className="quick-action-btn deposit-btn"
            onClick={() => navigate("/dashboard/deposit")}
          >
            <TrendingUp size={20} />
            <span>Deposit Money</span>
          </button>
          <button
            className="quick-action-btn withdraw-btn"
            onClick={() => navigate("/dashboard/withdraw")}
          >
            <TrendingDown size={20} />
            <span>Withdraw Money</span>
          </button>
          <button
            className="quick-action-btn history-btn"
            onClick={() => navigate("/dashboard/history")}
          >
            <Clock size={20} />
            <span>View History</span>
          </button>
        </div>
      </div>
      <div className="recent-transactions-section">
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate("/dashboard/history")}
          >
            View All
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-left">
                  {getTransactionIcon(transaction.type)}
                  <div className="transaction-details">
                    <p className="transaction-type">{transaction.type}</p>
                    {transaction.target_user && (
                      <p className="transaction-target">
                        To: @{transaction.target_user}
                      </p>
                    )}
                    <p className="transaction-date">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className="transaction-right">
                  <span
                    className={`transaction-amount ${
                      transaction.type === "Deposit" ? "positive" : "negative"
                    }`}
                  >
                    {transaction.type === "Deposit" ? "+" : "-"}
                    {transaction.amount.toFixed(2)} {transaction.currency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="chart-section">
        <h2 className="section-title">Monthly Activity</h2>
        <div className="chart-container">
          {Object.keys(monthlyData).length === 0 ? (
            <div className="empty-state">
              <p>No activity data available</p>
            </div>
          ) : (
            <div className="bar-chart">
              {Object.entries(monthlyData).map(([month, data]) => {
                const maxValue = Math.max(data.deposits, data.withdrawals, 100);
                const depositHeight = (data.deposits / maxValue) * 100;
                const withdrawalHeight = (data.withdrawals / maxValue) * 100;

                return (
                  <div key={month} className="chart-bar-group">
                    <div className="chart-bars">
                      <div
                        className="chart-bar deposit-bar"
                        style={{ height: `${depositHeight}%` }}
                        title={`Deposits: ${data.deposits} ILS`}
                      ></div>
                      <div
                        className="chart-bar withdrawal-bar"
                        style={{ height: `${withdrawalHeight}%` }}
                        title={`Withdrawals: ${data.withdrawals} ILS`}
                      ></div>
                    </div>
                    <span className="chart-label">{month}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color deposit-color"></span>
              <span>Deposits</span>
            </div>
            <div className="legend-item">
              <span className="legend-color withdrawal-color"></span>
              <span>Withdrawals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
