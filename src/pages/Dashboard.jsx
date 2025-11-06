import "@/styles/Dashboard/dashboardStyle.css";
import {
  History,
  Home,
  LogOut,
  Menu,
  Settings,
  Star,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBirthdayPopup, setShowBirthdayPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("birthdayShown");
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/dashboard/deposit", icon: TrendingUp, label: "Deposit" },
    { path: "/dashboard/withdraw", icon: TrendingDown, label: "Withdraw" },
    { path: "/dashboard/history", icon: History, label: "History" },
    { path: "/dashboard/watchlist", icon: Star, label: "Watchlist" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  if (!user) {
    return null;
  }

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    const birthDate = new Date(user.birth_date);

    const isBirthday =
      today.getDate() === birthDate.getDate() &&
      today.getMonth() === birthDate.getMonth();
    const birthdayShown = sessionStorage.getItem("birthdayShown");

    if (isBirthday && !birthdayShown) {
      toast.success(`Happy Birthday ${user.first_name}!`, {
        autoClose: 4000,
        theme: "colored",
      });

      sessionStorage.setItem("birthdayShown", "true");
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <button
        className="mobile-menu-button"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>
      <aside className="sidebar desktop-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-logo">Smart ATM</h1>
        </div>
        <div className="user-profile">
          <div className="user-profile-content">
            {user.profile_img ? (
              <img
                src={user.profile_img}
                alt={user.first_name}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                <User size={24} />
              </div>
            )}
            <div className="user-info">
              <p className="user-name">
                {user.first_name} {user.last_name}
              </p>
              <p className="user-username">@{user.user_name}</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay">
          <div
            className="mobile-sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="sidebar mobile-sidebar">
            <div className="sidebar-header mobile-sidebar-header">
              <h1 className="sidebar-logo">Smart ATM</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="close-button"
              >
                <X size={24} />
              </button>
            </div>

            <div className="user-profile">
              <div className="user-profile-content">
                {user.profile_img ? (
                  <img
                    src={user.profile_img}
                    alt={user.first_name}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    <User size={24} />
                  </div>
                )}
                <div className="user-info">
                  <p className="user-name">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="user-username">@{user.user_name}</p>
                </div>
              </div>
            </div>
            <nav className="sidebar-nav">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? "nav-item-active" : ""}`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="sidebar-footer">
              <button onClick={handleLogout} className="logout-button">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;

