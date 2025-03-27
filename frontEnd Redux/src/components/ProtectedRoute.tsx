import  { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store/store";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state:RootState) => state.auth.isAuthenticated
  );
  const isLoading = useSelector((state: any) => state.auth.isLoading);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for the authentication check to complete
    if (!isLoading) {
      setCheckingAuth(false);
    }
  }, [isLoading]);

  // Show loading indicator while checking authentication
  if (isLoading || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
