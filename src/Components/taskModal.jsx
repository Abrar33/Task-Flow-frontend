import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { FaTimes, FaExclamationCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TaskModal = ({ isOpen, onClose, onSave, task, currentListId, boardMembers }) => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-xl transform transition-all p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {task ? "Edit Task" : "Create Task"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {task ? "Update task details below" : "Fill in the details for your new task"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 -mr-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              placeholder="e.g., Set up database"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 resize-none"
              placeholder="Detailed description..."
            />
          </div>

          {/* New Layout for Deadline and Assign to */}
          <div className="flex flex-col gap-6">
            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign To
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-xl p-3 bg-gray-50 dark:bg-gray-800">
                {boardMembers.map((member) => (
                  <label
                    key={member.user._id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={assignedTo.includes(member.user._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAssignedTo([...assignedTo, member.user._id]);
                        } else {
                          setAssignedTo(assignedTo.filter((id) => id !== member.user._id));
                        }
                      }}
                      className="form-checkbox h-5 w-5 rounded text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {member.user.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{member.user.email}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 px-4 py-3 rounded-xl">
              <FaExclamationCircle className="mr-3" />
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 transition-colors duration-200"
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