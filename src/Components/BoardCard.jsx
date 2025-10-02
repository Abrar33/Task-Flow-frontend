// BoardCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaTasks } from "react-icons/fa";

const BoardCard = ({ board, darkMode }) => {
  if (!board) return null;

  const memberCount = board.members?.length ?? 0;
  const taskCount = board.lists?.length ?? 0;

  const cardBg = darkMode
    ? "bg-gradient-to-br from-gray-800 to-gray-700"
    : "bg-white";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-200";

  // New, more dramatic shadow and hover effect classes
  const shadowClass = darkMode
    ? "shadow-xl shadow-cyan-500/30" // A subtle blue/cyan glow in dark mode
    : "shadow-2xl shadow-indigo-500/40"; // A deep indigo shadow in light mode
  
  const hoverClass = "hover:shadow-3xl hover:shadow-indigo-500/60"; // Even stronger shadow on hover

  return (
    <Link to={`/boards/${board._id}`}>
      <div
        className={`rounded-xl ${shadowClass} ${hoverClass} transform hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between h-full cursor-pointer ${cardBg}`}
      >
        <div>
          <h2 className={`text-2xl font-bold mb-2 break-words ${textPrimary}`}>
            {board.name}
          </h2>
          <p className={`text-sm mb-4 break-words ${textSecondary}`}>
            {board.description || "No description provided."}
          </p>
        </div>
        <div
          className={`mt-4 border-t pt-4 flex justify-between items-center text-sm ${textSecondary} border-dashed ${borderColor}`}
        >
          <span className="flex items-center gap-2">
            <FaUsers />
            {memberCount} {memberCount === 1 ? "Member" : "Members"}
          </span>
          <span className="flex items-center gap-2">
            <FaTasks />
            {taskCount} {taskCount === 1 ? "Task List" : "Task Lists"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;