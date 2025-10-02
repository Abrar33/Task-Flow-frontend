// AllBoards.jsx
import React, { useEffect } from "react";
import { useBoardContext } from "../context/boardContext";
import BoardCard from "./BoardCard";
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const AllBoards = ({ darkMode }) => {
  const { boards, loading, error, fetchBoards } = useBoardContext();
  const { user, rehydrated } = useAuth();

  useEffect(() => {
    if (rehydrated && user) {
      fetchBoards();
    }
  }, [rehydrated, user, fetchBoards]);

  const baseText = darkMode ? "text-gray-100" : "text-gray-900";
  const subText = darkMode ? "text-gray-400" : "text-gray-600";
  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-50";

  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center h-screen ${subText}`}>
        <FaCog className="animate-spin text-4xl mb-2" />
        <span className="text-lg">Loading boards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <FaExclamationCircle className="text-4xl mb-2" />
        <span className="text-lg">Error loading boards.</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen m-0 ${bgColor} px-6 py-10 transition-colors duration-300`}>
      <h1 className={`text-4xl font-extrabold mb-8 ${baseText} tracking-tight`}>
        My Boards
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {boards.length > 0 ? (
          boards.map((board) => (
            <BoardCard key={board._id} board={board} darkMode={darkMode} />
          ))
        ) : (
          <p className={`col-span-full text-center text-lg ${subText}`}>
            You don't have any boards yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllBoards;