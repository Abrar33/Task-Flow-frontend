import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children }) => {
  const { user, rehydrated } = useAuth();

  if (!rehydrated) {
    // 👇 Wait until we know if the user is logged in
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
