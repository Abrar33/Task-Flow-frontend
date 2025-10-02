import React, { useEffect, useRef } from "react";
import { useNotifications } from "../context/notificationsContext";
import {
  FaBell,
  FaSpinner,
  FaClock,
  FaClipboardList,
  FaUserPlus,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const NotificationCenter = ({ darkMode }) => {
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

  // Handles infinite scrolling (logic remains the same)
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollContainerRef.current;
      if (el && hasMore && !isFetching) {
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
    let icon, colorClass;
    switch (notif.type) {
      case "deadline_reminder":
        icon = <FaClock />;
        colorClass = "bg-rose-500 dark:bg-rose-600 text-white";
        break;
      case "task_assignment":
        icon = <FaUserPlus />;
        colorClass = "bg-indigo-500 dark:bg-indigo-600 text-white";
        break;
      case "board_action":
      default:
        icon = <FaClipboardList />;
        colorClass = "bg-cyan-500 dark:bg-cyan-600 text-white";
        break;
    }
    return { icon, colorClass };
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Updated styles for better visual separation and polish
  const containerBg = darkMode ? "bg-gray-950" : "bg-gray-50"; // Changed light mode to gray-50 for contrast
  const cardBg = darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-xl"; // Enhanced shadow
  const unreadHighlight = darkMode ? "bg-gray-800 border-blue-700" : "bg-blue-50 border-blue-300"; // Changed light unread to blue-50
  const headingText = darkMode ? "text-gray-100" : "text-gray-900"; // Changed light heading to 900
  const bodyText = darkMode ? "text-gray-300" : "text-gray-600";
  const linkText = darkMode ? "text-indigo-400" : "text-indigo-600";


  return (
    // Set the outer container to flex-col and occupy the full viewport height.
    // The top padding is adjusted to account for a typical sticky header (e.g., 20)
    <div className={`flex flex-col min-h-screen px-6 py-10 pt-20 ${containerBg} transition-colors duration-300`}>
      <div className="flex justify-between items-center mb-8">
        <h1 className={`text-4xl font-bold flex items-center ${headingText}`}>
          <FaBell className="mr-3 text-blue-500 dark:text-blue-400" />
          Notification Center
          {unreadCount > 0 && (
            <span className="ml-4 px-3 py-1 text-sm bg-red-600 text-white font-semibold rounded-full shadow-md">
              {unreadCount} New
            </span>
          )}
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
          >
            <FaCheckCircle />
            Mark all as read
          </button>
        )}
      </div>

      {/* The main card body is now 'flex-grow' to take up remaining vertical space */}
      <div className={`flex-grow rounded-xl border ${cardBg} transition-shadow duration-300 overflow-hidden`}>
        {notifications.length === 0 && !isFetching ? (
          <p className={`text-center py-12 text-lg ${bodyText}`}>
            You're all caught up! No notifications. 🎉
          </p>
        ) : (
          <div
            ref={scrollContainerRef}
            // Use 'h-full' to make it fill the parent, and 'overflow-y-auto' to enable scrolling ONLY inside this div
            className="h-full overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700"
          >
            {notifications.map((notif) => {
              const { icon, colorClass } = getNotificationDetails(notif);
              
              // Added scale-[1.01] hover effect to unread for a more interactive feel
              const isReadClass = notif.isRead
                ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                : `${unreadHighlight} hover:shadow-md transform hover:scale-[1.01]`;

              return (
                <div
                  key={notif._id}
                  className={`flex items-start p-5 transition-all duration-200 ${isReadClass}`}
                >
                  <div className={`p-3 rounded-lg shadow-sm flex-shrink-0 ${colorClass}`}>
                    <span className="text-lg">{icon}</span>
                  </div>

                  <div
                    className="flex-1 ml-4 cursor-pointer"
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <p
                      className={`text-base leading-snug ${
                        notif.isRead
                          ? `${bodyText} font-normal`
                          : `${headingText} font-semibold`
                      }`}
                    >
                      {notif.message}
                    </p>
                    <span className="text-xs mt-1 block text-gray-500 dark:text-gray-400">
                      <FaClock className="inline-block mr-1" />
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                    {notif.link && (
                      <Link
                        to={notif.link}
                        className={`${linkText} hover:underline text-sm mt-2 block font-medium`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details →
                      </Link>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                    title="Delete notification"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              );
            })}

            {isFetching && (
              <div className="text-center py-6">
                <FaSpinner className="animate-spin text-2xl text-indigo-500" />
                <p className={`text-sm mt-2 ${bodyText}`}>Loading more...</p>
              </div>
            )}

            {!hasMore && notifications.length > 0 && (
              <p className="text-center py-4 text-xs text-gray-400 dark:text-gray-600 border-t dark:border-gray-700">
                — End of notifications —
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;