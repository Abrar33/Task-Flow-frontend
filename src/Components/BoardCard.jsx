// BoardCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaTasks } from "react-icons/fa";

const BoardCard = ({ board }) => {
  // Add a safety check for the board prop itself
  if (!board) {
    return null; // Don't render anything if the board is null or undefined
  }

  // Use optional chaining and nullish coalescing for safe access
  const memberCount = board.members?.length ?? 0;
  const taskCount = board.lists?.length ?? 0;

  return (
    <Link to={`/boards/${board._id}`}>
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between h-full cursor-pointer">
  <div>
    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 break-words">
      {board.name}
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 break-words">
      {board.description || "No description provided."}
    </p>
  </div>
  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
    <span className="flex items-center">
      <FaUsers className="mr-2" />
      {memberCount} {memberCount === 1 ? "Member" : "Members"}
    </span>
    <span className="flex items-center">
      <FaTasks className="mr-2" />
      {taskCount} {taskCount === 1 ? "Task List" : "Task Lists"}
    </span>
  </div>
</div>
    </Link>
  );
};

export default BoardCard;