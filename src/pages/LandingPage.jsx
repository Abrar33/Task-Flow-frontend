import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to Kanban Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your collaborative, real-time to-do board.
        </p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-105 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
