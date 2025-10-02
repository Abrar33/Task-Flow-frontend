import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  FaTimes,
  FaExclamationCircle,
  FaUserCircle,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// Avatar helper
const UserAvatar = ({ user, size = "h-8 w-8" }) => {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : user.email.substring(0, 2).toUpperCase();

  const hash = user._id
    .split("")
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = [
    "bg-red-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-indigo-400",
    "bg-pink-400",
    "bg-teal-400",
  ];
  const color = colors[hash % colors.length];

  return (
    <div
      className={`flex items-center justify-center rounded-full ${size} ${color} text-white font-semibold text-sm select-none shadow-md`}
    >
      {initials}
    </div>
  );
};

const TaskModal = ({
  darkMode,
  isOpen,
  onClose,
  onSave,
  task,
  currentListId,
  boardMembers,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [listId, setListId] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setDeadline(
        task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : ""
      );
      setListId(task.listId || "");
      setAssignedTo(task.assignedTo || []);
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
      setListId(currentListId || "");
      setAssignedTo([]);
    }
    setErrorMessage("");
  }, [task, currentListId, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Task title is required!");
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || null,
      listId,
      assignedTo,
    };

    if (task && task._id) {
      taskData._id = task._id;
    }

    onSave(taskData);
    toast.success(`Task ${task ? "updated" : "created"} successfully!`);
    onClose();
  };

  const handleAssignmentChange = (userId, isChecked) => {
    setAssignedTo((prev) =>
      isChecked ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  const assignedMembers = boardMembers
    .filter((member) => assignedTo.includes(member.user._id))
    .map((member) => member.user);

  const sortedBoardMembers = [...boardMembers].sort((a, b) =>
    a.user.name.localeCompare(b.user.name)
  );

  // Theme-aware colors
  const bgCard = darkMode ? "bg-gray-900" : "bg-white";
  const bgHeader = darkMode ? "bg-gray-800" : "bg-gray-50";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const subText = darkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-200";
  const inputBg = darkMode ? "bg-gray-800" : "bg-white";
  const inputBorder = darkMode ? "border-gray-700" : "border-gray-200";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all p-0 overflow-hidden ${bgCard}`}
      >
        {/* Header */}
        <div
          className={`flex justify-between items-center p-6 border-b ${borderColor} ${bgHeader}`}
        >
          <h2 className={`text-xl font-bold ${textPrimary}`}>
            {task ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className={`transition-colors p-2 ${subText} hover:text-red-500`}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-3xl font-extrabold px-0 py-1 border-0 border-b-2 ${textPrimary} ${bgCard} focus:border-blue-500 focus:ring-0 placeholder-gray-400 outline-none`}
              placeholder="Task Title (required)"
              required
            />
          </div>

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Description */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label
                  className={`flex items-center text-sm font-medium mb-2 ${textSecondary}`}
                >
                  <FaExclamationCircle className="mr-2 h-4 w-4 text-blue-500" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="6"
                  className={`w-full p-4 rounded-xl border ${inputBorder} ${inputBg} ${textPrimary} focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-sm`}
                  placeholder="Add a detailed description..."
                />
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Deadline */}
              <div>
                <label
                  className={`flex items-center text-xs font-semibold uppercase tracking-wider mb-2 ${subText}`}
                >
                  <FaRegCalendarAlt className="mr-2 h-3 w-3" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${inputBorder} ${inputBg} ${textPrimary} focus:ring-blue-500 text-sm`}
                />
              </div>

              {/* Assignees */}
              <div>
                <label
                  className={`flex items-center text-xs font-semibold uppercase tracking-wider mb-2 ${subText}`}
                >
                  <FaUserCircle className="mr-2 h-3 w-3" />
                  Assignees
                </label>

                {/* Current Assignees */}
                <div className="flex flex-wrap gap-2 py-2 min-h-[40px] items-center">
                  {assignedMembers.length > 0 ? (
                    assignedMembers.map((user) => (
                      <div
                        key={user._id}
                        className={`flex items-center text-xs font-medium px-3 py-1 rounded-full shadow-sm ${
                          darkMode
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        <UserAvatar user={user} size="h-5 w-5 mr-2" />
                        {user.name.split(" ")[0]}
                      </div>
                    ))
                  ) : (
                    <span
                      className={`text-sm italic ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      No one assigned
                    </span>
                  )}
                </div>

                {/* Dropdown */}
                <div
                  className={`mt-3 border ${inputBorder} rounded-xl p-3 max-h-40 overflow-y-auto shadow-inner ${inputBg}`}
                >
                  {sortedBoardMembers.map((member) => (
                    <label
                      key={member.user._id}
                      className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 ${
                        darkMode ? "hover:bg-gray-700" : ""
                      } cursor-pointer transition-colors text-sm`}
                    >
                      <input
                        type="checkbox"
                        checked={assignedTo.includes(member.user._id)}
                        onChange={(e) =>
                          handleAssignmentChange(
                            member.user._id,
                            e.target.checked
                          )
                        }
                        className="form-checkbox h-4 w-4 rounded text-blue-600 border-gray-300"
                      />
                      <UserAvatar user={member.user} size="h-7 w-7" />
                      <span className={`${textPrimary} truncate`}>
                        {member.user.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div
              className={`mt-6 flex items-center text-sm px-4 py-3 rounded-xl shadow-inner ${
                darkMode
                  ? "text-red-400 bg-red-900/40"
                  : "text-red-600 bg-red-50"
              }`}
            >
              <FaExclamationCircle className="mr-3" />
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div
            className={`flex justify-end space-x-3 pt-6 mt-6 border-t ${borderColor}`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 rounded-xl border ${borderColor} ${textSecondary} hover:bg-gray-100 ${
                darkMode ? "hover:bg-gray-700" : ""
              } transition-colors shadow-sm`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
            >
              {task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskModal;
