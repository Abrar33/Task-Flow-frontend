// frontend/src/context/authContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as authApi from "../apis/authApi";
import { useSocket } from "./socketContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rehydrated, setRehydrated] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();

  // ✅ load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setRehydrated(true);
  }, []);

  // ✅ Connect to Socket.IO user room after user is set
  useEffect(() => {
    if (user && user._id && socket) {
      console.log(`👤 Joining user room with ID: ${user._id}`);
      socket.emit("joinUser", user._id);
    }
  }, [user, socket]);

  // ✅ signup
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password });

      const normalizedUser = {
        ...data.user,
        _id: data.user._id || data.user.id,
      };

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // Store login + activity timestamps
      const now = Date.now().toString();
      localStorage.setItem("loginTime", now);
      localStorage.setItem("lastActivity", now);

      setUser(normalizedUser);
      toast.success("Account created successfully 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });

      const normalizedUser = {
        ...data.user,
        _id: data.user._id || data.user.id,
      };

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // Store login + activity timestamps
      const now = Date.now().toString();
      localStorage.setItem("loginTime", now);
      localStorage.setItem("lastActivity", now);

      setUser(normalizedUser);
      toast.success("Logged in successfully 🚀");
      navigate("/");
      console.log("👤 User logged in:", normalizedUser);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ logout
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("lastActivity");
    setUser(null);
    toast.info("Logged out");
    navigate("/login");
  };

  // ✅ Track user activity (reset lastActivity timestamp)
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // ✅ Auto-logout checker (24h session OR 7h inactivity)
  useEffect(() => {
    if (!user) return;

    const checkTimeout = () => {
      const now = Date.now();

      const loginTime = parseInt(localStorage.getItem("loginTime"), 10);
      const lastActivity = parseInt(localStorage.getItem("lastActivity"), 10);

      // 24 hours session expiry
      if (loginTime && now - loginTime > 24 * 60 * 60 * 1000) {
        toast.error("Session expired (24h). Please login again.");
        logout();
        return;
      }

      // 7 hours inactivity logout
      if (lastActivity && now - lastActivity > 7 * 60 * 60 * 1000) {
        toast.error("Logged out due to inactivity (7h).");
        logout();
        return;
      }
    };

    const interval = setInterval(checkTimeout, 60 * 1000); // check every 1 min
    return () => clearInterval(interval);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, rehydrated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
