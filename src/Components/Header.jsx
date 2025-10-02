// frontend/src/pages/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSearch,
  FaInfoCircle,
  FaPlus,
  FaMoon,
  FaSun,
  FaTimes, // Added for mobile close icon
} from "react-icons/fa";
import { useBoardContext } from "../context/boardContext";
import { useNotifications } from "../context/notificationsContext";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Header = ({ darkMode, setDarkMode }) => {
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // New state for mobile search view
  const [newBoardName, setNewBoardName] = useState("");
  
  // Use a different ref for the icon-based dropdowns (right side)
  const iconDropdownRef = useRef(null); 
  // Use one ref for the central area (Search/Create)
  const centralDropdownRef = useRef(null);
  const mobileSearchInputRef = useRef(null); // Ref for mobile search input

  const navigate = useNavigate();

  const { boards, fetchBoards, addBoard, loading } = useBoardContext();
  const { notifications } = useNotifications();
  const { logout } = useAuth();

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  // Initial board fetch
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const closeAllDropdowns = () => {
    setIsSearchDropdownOpen(false);
    setIsCreateDropdownOpen(false);
    setIsProfileDropdownOpen(false);
    // Keep mobile search open if it was explicitly opened, only close on button click
  };

  // Click outside handler for closing dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Logic for desktop dropdowns
      const isOutsideCentral = centralDropdownRef.current && !centralDropdownRef.current.contains(event.target);
      const isOutsideIcon = iconDropdownRef.current && !iconDropdownRef.current.contains(event.target);
      
      // Close all desktop dropdowns if the click is outside their containers
      if (isOutsideCentral && isOutsideIcon) {
        closeAllDropdowns();
      }
      
      // Logic for mobile search
      if (isMobileSearchOpen && mobileSearchInputRef.current && !mobileSearchInputRef.current.contains(event.target)) {
        // Optionally close mobile search if clicked outside, but often it's better to keep it open until the user hits close/back.
        // For simplicity here, we'll let the explicit close button handle it.
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSearchOpen]);
  
  // Focus the mobile search input when the mobile search view opens
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);


  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    try {
      const newBoard = await addBoard({ name: newBoardName });
      if (!newBoard?._id) throw new Error("Board not created");

      setNewBoardName("");
      setIsCreateDropdownOpen(false);
      fetchBoards(); // Refetch to update the search dropdown immediately
      navigate(`/boards/${newBoard._id}`);
    } catch (err) {
      console.error("Error creating board:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // A reusable button component for the right-side icons
  const IconButton = ({ children, onClick = () => {} }) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-full transition duration-200 transform hover:scale-105 active:scale-95
        ${darkMode ? "text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-blue-500" : "text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"}
      `}
    >
      {children}
    </button>
  );

  return (
    <header
      className={`sticky top-0 z-40 px-4 sm:px-6 py-3 flex items-center justify-between transition-colors duration-300
        ${
          darkMode
            ? "bg-gray-950/90 border-b border-gray-800 shadow-2xl shadow-gray-900/50"
            : "bg-white border-b border-gray-300 shadow-lg shadow-gray-100/50"
        } backdrop-blur-md
      `}
    >
      {/* ------------------ MOBILE SEARCH OVERLAY ------------------ */}
      {isMobileSearchOpen && (
        <div 
          className={`md:hidden absolute top-0 left-0 w-full h-full p-4 flex items-center transition-all duration-300 transform ${darkMode ? "bg-gray-950/95" : "bg-white/95"} z-50`}
        >
          <div className="relative flex-1" ref={mobileSearchInputRef}>
            <input
              type="text"
              placeholder="Search boards..."
              className={`w-full pl-12 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm
                ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400"
                    : "border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-500"
                }
              `}
            />
            <FaSearch
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          <IconButton onClick={() => setIsMobileSearchOpen(false)}>
            <FaTimes size={18} />
          </IconButton>
          {/* Note: You should add the search results dropdown logic here for mobile if needed */}
        </div>
      )}
      {/* ----------------------------------------------------------- */}

      {/* Left: Logo (Hidden when mobile search is open) */}
      <div className={`flex items-center space-x-3 cursor-pointer ${isMobileSearchOpen ? 'hidden md:flex' : ''}`} onClick={() => navigate("/")}>
        {/* Enhanced Logo Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-105 transition duration-200">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
          Task<span className="text-blue-500">Flow</span>
        </h1>
      </div>

      {/* Middle: Search & Create (Desktop Only) */}
      <div
        ref={centralDropdownRef}
        className="relative flex-1 max-w-xl mx-6 hidden md:flex items-center space-x-3"
      >
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search boards, tasks, users..."
            onClick={() => {
              setIsSearchDropdownOpen(!isSearchDropdownOpen);
              setIsCreateDropdownOpen(false);
              setIsProfileDropdownOpen(false);
            }}
            readOnly={true} 
            className={`w-full pl-12 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm cursor-pointer
              ${
                darkMode
                  ? "border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 hover:border-blue-500"
                  : "border-gray-200 bg-white text-gray-800 placeholder-gray-500 hover:border-blue-500"
              }
            `}
          />
          <FaSearch
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />

          {isSearchDropdownOpen && (
            <div
              className={`absolute top-full mt-3 w-full rounded-xl shadow-2xl z-50 p-4 transition duration-300 origin-top animate-dropdown-open
                ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}
              `}
            >
              <h2
                className={`text-xs uppercase font-bold mb-3 tracking-wider ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Recent Boards
              </h2>
              <ul className="space-y-1 max-h-60 overflow-y-auto">
                {loading && (
                  <li className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    <div className="flex items-center space-x-2 p-2">
                        <div className="w-3 h-3 rounded bg-gray-400 animate-pulse"></div>
                        <span>Loading boards...</span>
                    </div>
                  </li>
                )}
                {!loading && boards.length === 0 && (
                  <li className={`text-sm p-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    No recent boards. Create one!
                  </li>
                )}
                {boards.map((board) => (
                  <li
                    key={board._id}
                    onClick={() => {
                      navigate(`/boards/${board._id}`);
                      closeAllDropdowns();
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition duration-150 text-sm
                      ${darkMode ? "hover:bg-gray-700 text-gray-200" : "hover:bg-blue-50 text-gray-700"}
                    `}
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-md"
                      style={{ backgroundColor: board.color || "#3B82F6" }}
                    />
                    <span className="truncate">{board.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Create Board */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCreateDropdownOpen(!isCreateDropdownOpen);
              setIsSearchDropdownOpen(false);
              setIsProfileDropdownOpen(false);
            }}
            className="flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 transition duration-200 transform hover:scale-[1.02] active:scale-100 text-sm font-medium"
          >
            <FaPlus className="mr-2" size={14} />
            <span>Create</span>
          </button>

          {isCreateDropdownOpen && (
            <div
              className={`absolute top-full mt-3 right-0 w-72 rounded-xl shadow-2xl z-50 p-5 transition duration-300 origin-top-right animate-dropdown-open
                ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}
              `}
            >
              <h2
                className={`text-base font-semibold mb-3 ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Create New Board
              </h2>
              <input
                type="text"
                placeholder="Board name (e.g., 'Q3 Marketing Plan')"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBoard();
                }}
                className={`w-full px-4 py-2 mb-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                  }
                `}
              />
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim()}
                className={`w-full py-2 rounded-xl font-medium transition duration-200 ${
                  !newBoardName.trim()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30"
                }`}
              >
                Create Board
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Icons (Responsive) */}
      <div ref={iconDropdownRef} className={`flex items-center space-x-1 sm:space-x-3 ${isMobileSearchOpen ? 'hidden md:flex' : ''}`}>
        
        {/* Mobile Search Icon (Visible on small screens) */}
        <div className="md:hidden">
            <IconButton onClick={() => setIsMobileSearchOpen(true)}>
                <FaSearch size={18} />
            </IconButton>
        </div>
        
        {/* Mobile Create Icon (Visible on small screens) */}
        <div className="relative md:hidden">
          <IconButton onClick={() => {
              setIsCreateDropdownOpen(!isCreateDropdownOpen);
              setIsProfileDropdownOpen(false);
          }}>
              <FaPlus size={18} />
          </IconButton>
           {/* Reusing the desktop create dropdown for mobile, anchored to the right */}
          {isCreateDropdownOpen && (
            <div
              className={`absolute top-full mt-3 right-0 w-72 rounded-xl shadow-2xl z-50 p-5 transition duration-300 origin-top-right animate-dropdown-open
                ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}
              `}
            >
              <h2
                className={`text-base font-semibold mb-3 ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                Create New Board
              </h2>
              <input
                type="text"
                placeholder="Board name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateBoard();
                }}
                className={`w-full px-4 py-2 mb-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                  }
                `}
              />
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim()}
                className={`w-full py-2 rounded-xl font-medium transition duration-200 ${
                  !newBoardName.trim()
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/30"
                }`}
              >
                Create Board
              </button>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <IconButton onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? <FaSun size={18} className="text-yellow-400" /> : <FaMoon size={18} />}
        </IconButton>

        {/* Notifications */}
        <div className="relative">
          <IconButton onClick={() => navigate("/notifications")}>
            <FaBell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-600 text-white text-[10px] font-bold rounded-full h-8 w-8 flex items-center justify-center border-2 border-current">
                {unreadCount}
              </span>
            )}
          </IconButton>
        </div>

        {/* Info (Moved to be more compact on mobile) */}
        <IconButton onClick={() => navigate("/about")}>
          <FaInfoCircle size={18} />
        </IconButton>

        {/* Profile */}
        <div className="relative">
          <IconButton
            onClick={() => {
              setIsProfileDropdownOpen(!isProfileDropdownOpen);
              setIsSearchDropdownOpen(false);
              setIsCreateDropdownOpen(false);
            }}
          >
            <FaUserCircle size={24} />
          </IconButton>
          {isProfileDropdownOpen && (
            <div
              className={`absolute top-full right-0 mt-3 w-48 rounded-xl shadow-2xl z-50 p-2 transition duration-300 origin-top-right animate-dropdown-open
                ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}
              `}
            >
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg transition duration-150 flex items-center space-x-2
                      ${darkMode ? "text-gray-200 hover:bg-red-800/50 hover:text-red-300" : "text-gray-700 hover:bg-red-50 hover:text-red-600"}
                    `}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-4a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span>Log out</span>
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