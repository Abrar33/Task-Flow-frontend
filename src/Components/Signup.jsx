import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const SignUpPage = () => {
  const { signup, loading } = useAuth(); // use context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Form validation before calling signup
  const handleSignUp = (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Full name is required");
    if (!email.includes("@")) return toast.error("Enter a valid email");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    signup(name, email, password); // call context signup
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 disabled:bg-blue-400"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Already have an account? Log In
          </Link>
          <Link to="/" className="ml-4 text-gray-600 dark:text-gray-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
