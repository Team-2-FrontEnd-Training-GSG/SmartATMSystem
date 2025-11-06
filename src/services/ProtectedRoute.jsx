import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const user = localStorage.getItem("user") || null;
  if (!user) {
    alert("Please log in to access this page");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
