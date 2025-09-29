// AllBoards.jsx
import React, { useEffect } from "react";
import { useBoardContext } from "../context/boardContext";
import BoardCard from "./BoardCard"; // You'll create this next
import { FaCog, FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "../context/authContext";

const AllBoards = () => {
  const { boards, loading, error, fetchBoards } = useBoardContext();
const { user, rehydrated } = useAuth(); // ✅ get user and rehydration status

 useEffect(() => {
  // console.log("Rehydrated:", rehydrated, "User:", user);
  if (rehydrated && user) {
    fetchBoards();
  }}, [rehydrated, user, fetchBoards]);;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <FaCog className="animate-spin text-4xl" />
        <span className="ml-2">Loading boards...</span>
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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        My Boards
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {boards.length > 0 ? (
          boards.map((board) => (
            <BoardCard key={board._id} board={board} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center">
            You don't have any boards yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllBoards;