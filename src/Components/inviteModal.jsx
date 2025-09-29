import React, { useState } from "react";
import Modal from "./Modal";

const InviteModal = ({ isOpen, onClose, onInvite }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite(email, role);
    setEmail("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Invite User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default InviteModal;
