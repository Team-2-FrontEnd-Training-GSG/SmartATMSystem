import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";

import DashboardHome from "./pages/DashboardHome";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Watchlist from "./pages/Watchlist";
import History from "./pages/History";
import ProtectedRoute from "./services/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
      // Protected routes
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="deposit" element={<Deposit />} />

            <Route path="withdraw" element={<Withdraw />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="history" element={<History />} />
            {/*
        <Route path="settings" element={<Settings />} /> */}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  );
}

export default App;
