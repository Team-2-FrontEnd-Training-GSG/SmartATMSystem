import "@/styles/Dashboard/historyStyle.css";
import {
  ArrowLeft,
  History as HistoryIcon,
  Filter,
  Search,
  Download,
  RefreshCcw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/dashboard";

function History() {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser());
  const [transactions, setTransactions] = useState([]);

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [currencyFilter, setCurrencyFilter] = useState("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [q, setQ] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    const tx = Array.isArray(u?.transactions) ? u.transactions.slice() : [];
    tx.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(tx);
  }, []);

  const currencies = useMemo(() => {
    const set = new Set(transactions.map((t) => t.currency).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [transactions]);

  const filtered = useMemo(() => {
    let data = transactions;

    if (typeFilter !== "ALL") {
      data = data.filter((t) => t.type === typeFilter);
    }
    if (currencyFilter !== "ALL") {
      data = data.filter((t) => t.currency === currencyFilter);
    }
    if (minAmount !== "") {
      const v = parseFloat(minAmount);
      if (!Number.isNaN(v)) data = data.filter((t) => t.amount >= v);
    }
    if (maxAmount !== "") {
      const v = parseFloat(maxAmount);
      if (!Number.isNaN(v)) data = data.filter((t) => t.amount <= v);
    }
    if (dateFrom) {
      const from = new Date(dateFrom);
      data = data.filter((t) => new Date(t.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      data = data.filter((t) => new Date(t.date) <= to);
    }
    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      data = data.filter(
        (t) =>
          (t.type || "").toLowerCase().includes(qq) ||
          (t.currency || "").toLowerCase().includes(qq)
      );
    }
    return data;
  }, [
    transactions,
    typeFilter,
    currencyFilter,
    minAmount,
    maxAmount,
    dateFrom,
    dateTo,
    q,
  ]);

  const summary = useMemo(() => {
    let deposits = 0;
    let withdraws = 0;
    for (const t of filtered) {
      if (t.type === "Deposit") deposits += t.amount;
      if (t.type === "Withdraw") withdraws += t.amount;
    }
    return { deposits, withdraws, count: filtered.length };
  }, [filtered]);

  // for pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(pageStart, pageStart + pageSize);

  const formatDateTime = (iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} ${time}`;
  };

  const resetFilters = () => {
    setTypeFilter("ALL");
    setCurrencyFilter("ALL");
    setMinAmount("");
    setMaxAmount("");
    setDateFrom("");
    setDateTo("");
    setQ("");
    setPage(1);
  };

  const refreshFromStorage = () => {
    const u = getUser();
    setUser(u);
    const tx = Array.isArray(u?.transactions) ? u.transactions.slice() : [];
    tx.sort((a, b) => new Date(b.date) - new Date(a.date));
    setTransactions(tx);
    setPage(1);
  };

  const exportCSV = () => {
    const rows = [
      ["id", "type", "amount", "currency", "date"],
      ...filtered.map((t) => [
        t.id ?? "",
        t.type ?? "",
        t.amount ?? "",
        t.currency ?? "",
        t.date ?? "",
      ]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            const s = String(cell ?? "");
            if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
            return s;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const username = user?.user_name || "user";
    a.download = `transactions_${username}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="history-container">
        <div className="history-card">
          <div className="card-header-row">
            <div className="card-title-row">
              <div className="card-icon">
                <HistoryIcon size={24} />
              </div>
              <div>
                <h1 className="card-title">Transaction History</h1>
                <p className="card-subtitle">
                  Review your deposits and withdrawals
                </p>
              </div>
            </div>
            <div className="actions-row">
              <button
                className="icon-button"
                title="Refresh"
                onClick={refreshFromStorage}
              >
                <RefreshCcw size={18} />
              </button>
              <button
                className="icon-button"
                title="Export CSV"
                onClick={exportCSV}
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="filters-bar">
            <div className="filter-chip">
              <Filter size={16} />
              <span>Filters</span>
            </div>

            <select
              className="select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdraw">Withdraw</option>
            </select>

            <select
              className="select"
              value={currencyFilter}
              onChange={(e) => {
                setCurrencyFilter(e.target.value);
                setPage(1);
              }}
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All currencies" : c}
                </option>
              ))}
            </select>

            <input
              className="input"
              type="number"
              placeholder="Min amount"
              value={minAmount}
              onChange={(e) => {
                setMinAmount(e.target.value);
                setPage(1);
              }}
              min="0"
            />
            <input
              className="input"
              type="number"
              placeholder="Max amount"
              value={maxAmount}
              onChange={(e) => {
                setMaxAmount(e.target.value);
                setPage(1);
              }}
              min="0"
            />

            <label>Date From</label>
            <input
              className="input"
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
            />
            <label>Date To</label>
            <input
              className="input"
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
            />

            <button className="clear-button" onClick={resetFilters}>
              Clear
            </button>
          </div>

          <div className="table-wrap">
            {pageItems.length === 0 ? (
              <div className="empty-state">
                <p>No transactions found.</p>
              </div>
            ) : (
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((t, i) => (
                    <tr key={t.id ?? `${t.type}-${t.date}-${i}`}>
                      <td>{pageStart + i + 1}</td>
                      <td>
                        <span
                          className={`type-pill ${
                            t.type === "Deposit"
                              ? "pill-deposit"
                              : "pill-withdraw"
                          }`}
                        >
                          {t.type}
                        </span>
                      </td>
                      <td
                        className={t.type === "Deposit" ? "amt-dep" : "amt-wd"}
                      >
                        {t.type === "Deposit" ? "+" : "-"}
                        {Number(t.amount).toFixed(2)}
                      </td>
                      <td>{t.currency}</td>
                      <td>{formatDateTime(t.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pagination-bar">
            <div className="pagination-left">
              <span>
                Showing <b>{pageItems.length}</b> of <b>{filtered.length}</b>{" "}
                records
              </span>
            </div>
            <div className="pagination-right">
              <select
                className="select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20, 50].map((v) => (
                  <option key={v} value={v}>
                    {v} / page
                  </option>
                ))}
              </select>

              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="page-indicator">
                {currentPage} / {totalPages}
              </span>
              <button
                className="page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="history-card secondary">
          <h2 className="card-title">Summary</h2>
          <div className="summary-grid">
            <div className="sum-item">
              <span className="sum-label">Deposits</span>
              <span className="sum-value success">
                +{summary.deposits.toFixed(2)}
              </span>
            </div>
            <div className="sum-item">
              <span className="sum-label">Withdrawals</span>
              <span className="sum-value danger">
                -{summary.withdraws.toFixed(2)}
              </span>
            </div>
            <div className="sum-item">
              <span className="sum-label">Records</span>
              <span className="sum-value">{summary.count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
