import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    await login(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Log In
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-6 space-x-4">
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Don’t have an account? Sign Up
          </Link>
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
