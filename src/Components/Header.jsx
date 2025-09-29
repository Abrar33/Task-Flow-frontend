// frontend/src/pages/Header.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
  FaInfoCircle,
  FaPlus,
} from "react-icons/fa";
import { useBoardContext } from "../context/boardContext";
import { useNotifications } from "../context/notificationsContext";
import { useAuth } from "../context/authContext"; // ⬅️ import useAuth hook
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Header = () => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // ⬅️ New state for profile dropdown
  const [newBoardName, setNewBoardName] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { boards, fetchBoards, addBoard, loading } = useBoardContext();
  const { notifications } = useNotifications();
  const { logout } = useAuth(); // ⬅️ Get logout function from auth context

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleSearchClick = (event) => {
    event.stopPropagation();
    setIsSearchDropdownOpen(!isSearchDropdownOpen);
    setIsCreateDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleCreateClick = (event) => {
    event.stopPropagation();
    setIsCreateDropdownOpen(!isCreateDropdownOpen);
    setIsSearchDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  // ⬅️ New click handler for profile dropdown
  const handleProfileClick = (event) => {
    event.stopPropagation();
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsSearchDropdownOpen(false);
    setIsCreateDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
        setIsCreateDropdownOpen(false);
        setIsProfileDropdownOpen(false); // ⬅️ Close profile dropdown
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const newBoard = await addBoard({ name: newBoardName });
      if (!newBoard?._id) throw new Error("Board not created");

      setNewBoardName("");
      setIsCreateDropdownOpen(false);
      fetchBoards();
      navigate(`/boards/${newBoard._id}`);
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  // ⬅️ New logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-800 p-2 flex flex-col md:flex-row justify-between items-center shadow-lg rounded-b-xl">
      {/* Left: Logo */}
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
          Task Flow
        </h1>
      </div>

      {/* Middle: Search & Create */}
      <div
        className="relative flex-1 w-full max-w-xl md:max-w-md mx-auto md:mx-4 flex items-center space-x-2"
        ref={dropdownRef}
      >
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-1 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-500"
            onClick={handleSearchClick}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          {isSearchDropdownOpen && (
            <div className="absolute top-full mt-2 w-full max-w-sm bg-white dark:bg-gray-700 rounded-lg shadow-xl z-50 p-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Recent boards
              </h2>
              <ul className="space-y-2">
                {loading && (
                  <li className="text-gray-500 dark:text-gray-400">
                    Loading boards...
                  </li>
                )}
                {!loading && boards.length === 0 && (
                  <li className="text-gray-500 dark:text-gray-400">
                    No boards found.
                  </li>
                )}
                {boards.map((board) => (
                  <li
                    key={board._id}
                    className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => navigate(`/boards/${board._id}`)}
                  >
                    <div
                      className="w-5 h-5 rounded"
                      style={{ backgroundColor: board.color || "#3B82F6" }}
                    ></div>
                    <span className="text-gray-800 dark:text-gray-100 text-sm">
                      {board.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Create */}
        <div className="relative">
          <button
            onClick={handleCreateClick}
            className="flex items-center px-4 py-1 bg-[#85B8FF] text-white rounded-full shadow-md hover:bg-[#6FA0E2] transition-colors"
          >
            <FaPlus className="mr-2" />
            <span>Create</span>
          </button>

          {isCreateDropdownOpen && (
            <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-50 p-4">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                New Board
              </h2>
              <input
                type="text"
                placeholder="Board name"
                className="w-full px-3 py-1 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
              <button
                onClick={handleCreateBoard}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 rounded transition-colors"
              >
                Create
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        {/* 🔔 Notification Bell */}
        <div className="relative">
          <button
            onClick={() => navigate("/notifications")}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FaBell size={20} />
          </button>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              {unreadCount}
            </span>
          )}
        </div>

        <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <FaInfoCircle size={20} />
        </button>
        
        {/* ⬅️ Profile Dropdown */}
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FaUserCircle size={24} />
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-50 p-2">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;