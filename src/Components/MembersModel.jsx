// frontend/src/Components/MembersModal.jsx

import React from "react";
import { FaTimes, FaCrown, FaUser, FaTrashAlt } from "react-icons/fa";

/**
 * Renders a modal displaying all members of the board and allowing admins to remove them.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {Array<object>} props.members - List of board member objects ({ user: { _id, username, email }, role }).
 * @param {function} props.onRemoveMember - Function to call when an admin clicks remove (userId, username).
 * @param {string} props.currentUserId - The ID of the currently logged-in user.
 * @param {boolean} props.isAdmin - True if the current user is an admin on this board.
 */
const MembersModal = ({
  isOpen,
  onClose,
  members,
  onRemoveMember,
  currentUserId,
  isAdmin,
}) => {
  if (!isOpen) return null;

  const sortedMembers = [...(members || [])].sort((a, b) => {
    // Put admins first
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    // Then sort alphabetically by username
    return a.user?.username.localeCompare(b.user?.username);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Board Members
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Member List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {sortedMembers.map((member) => (
            <div
              key={member.user._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div className="flex items-center space-x-3 truncate">
                {member.role === "admin" ? (
                  <FaCrown className="text-yellow-500 flex-shrink-0" title="Admin" />
                ) : (
                  <FaUser className="text-blue-500 flex-shrink-0" title="Member" />
                )}
                <span className={`font-medium ${member.user._id === currentUserId ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-gray-200'} truncate`}>
                  {member.user.username}
                  {member.user._id === currentUserId && " (You)"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({member.role})</span>
              </div>

              {/* Remove Button - Only visible to Admins, and not for self-removal */}
              {isAdmin && member.user._id !== currentUserId && (
                <button
                  onClick={() => onRemoveMember(member.user._id, member.user.username)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded transition flex-shrink-0"
                  title={`Remove ${member.user.username}`}
                >
                  <FaTrashAlt />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersModal;