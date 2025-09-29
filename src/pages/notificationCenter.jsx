// frontend/src/Components/NotificationCenter.js

import React, { useEffect, useRef } from "react";
import { useNotifications } from "../context/notificationsContext";
import { FaBell, FaCheckCircle, FaSpinner, FaClock, FaClipboardList, FaUserPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotificationCenter = () => {
  const {
    notifications,
    markNotificationAsRead,
    deleteNotification,
    hasMore,
    loadMoreNotifications,
    isFetching,
    markAllAsRead,
  } = useNotifications();

  const scrollContainerRef = useRef(null);

  // Handles infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (el && hasMore && !isFetching) {
        // Check if the user has scrolled to the bottom
        if (el.scrollHeight - el.scrollTop <= el.clientHeight + 100) {
          loadMoreNotifications();
        }
      }
    };

    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, isFetching, loadMoreNotifications]);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      markNotificationAsRead(notif._id);
    }
  };

  const getNotificationDetails = (notif) => {
    let icon;
    let colorClass;
    let description;

    switch (notif.type) {
      case "deadline_reminder":
        icon = <FaClock />;
        colorClass = "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100";
        description = "Task deadline is approaching";
        break;
      case "task_assignment":
        icon = <FaUserPlus />;
        colorClass = "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-100";
        description = "You've been assigned a new task";
        break;
      case "board_action":
      default:
        icon = <FaClipboardList />;
        colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100";
        description = "Activity on a board you're a member of";
        break;
    }
    return { icon, colorClass, description };
  };

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <FaBell className="inline-block mr-3 text-blue-500" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-3 text-sm px-2 py-1 bg-red-500 text-white rounded-full">
              {unreadCount} Unread
            </span>
          )}
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {notifications.length > 0 ? (
          <div ref={scrollContainerRef} className="max-h-[70vh] overflow-y-auto">
            {notifications.map((notif) => {
              const { icon, colorClass } = getNotificationDetails(notif);
              return (
                <div
                  key={notif._id}
                  className={`flex items-start p-4 border-b border-gray-200 dark:border-gray-700 transition-colors ${
                    notif.isRead ? "bg-white dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900"
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <div className={`p-3 rounded-full ${colorClass}`}>
                    {icon}
                  </div>
                  <div className="flex-1 ml-4 cursor-pointer" onClick={() => handleNotificationClick(notif)}>
                    <p className={`font-semibold ${notif.isRead ? "text-gray-600 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"}`}>
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className="text-blue-500 hover:underline text-sm mt-1 block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details
                      </Link>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    title="Delete notification"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              );
            })}

            {isFetching && (
              <div className="text-center py-4">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
              </div>
            )}
            {!isFetching && notifications.length === 0 && (
              <p className="text-center py-6 text-gray-500 dark:text-gray-400">
                You have no notifications.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            {isFetching ? "Loading notifications..." : "You have no notifications."}
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;