// frontend/src/context/notificationContext.js

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./authContext";
import { useSocket } from "./socketContext";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Use a useRef for the fetching state to avoid re-render loops
  const isFetchingRef = useRef(false);

  // Add or update notification locally
  const addNotification = useCallback((notif) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => n._id === notif._id);
      if (exists) {
        return prev.map((n) => (n._id === notif._id ? notif : n));
      }
      return [notif, ...prev.slice(0, 19)];
    });
  }, []);

  // Fetch paginated notifications from the API - this function is now standalone
  const fetchNotifications = useCallback(async (pageToFetch = 1) => {
    if (!user || isFetchingRef.current) return;

    isFetchingRef.current = true;
    try {
      const res = await fetch(`https://task-flow-backend-umber.vercel.app/api/notifications?page=${pageToFetch}&limit=20`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (res.ok) {
        const { notifications: newNotifs, totalPages, currentPage } = await res.json();
        
        setNotifications((prev) => {
          return currentPage === 1 ? newNotifs : [...prev, ...newNotifs];
        });

        setPage(currentPage);
        setHasMore(currentPage < totalPages);
        console.log("📥 Fetched notifications with pagination:", newNotifs);
      } else {
        console.error("❌ Failed to fetch notifications:", res.statusText);
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [user]);

  // Function to load the next page of notifications
  const loadMoreNotifications = useCallback(() => {
    if (hasMore && !isFetchingRef.current) {
      fetchNotifications(page + 1);
    }
  }, [hasMore, page, fetchNotifications]);

  // Mark one notification as read
  const markNotificationAsRead = useCallback(async (id) => {
    // ... (rest of the code is the same)
    try {
      const res = await fetch(`https://task-flow-backend-umber.vercel.app/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    // ... (rest of the code is the same)
    try {
      const res = await fetch("https://task-flow-backend-umber.vercel.app/api/notifications/readAll", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("❌ Failed to mark all as read:", err);
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (id) => {
    // ... (rest of the code is the same)
    try {
      const res = await fetch(`https://task-flow-backend-umber.vercel.app/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error("❌ Failed to delete notification:", err);
    }
  }, []);

  // Use a separate `useEffect` for the initial fetch logic
  useEffect(() => {
    // An IIFE to handle the async call within the effect
    (async () => {
      if (user?._id && socket) {
        console.log("✅ Joined user room:", user._id);
        socket.emit("joinUser", user._id);
        
        // Call the stable fetch function
        await fetchNotifications(1);
      }
    })();

    // This part handles the socket listener and cleanup
    if (!socket) return;
    const handleNewNotification = (notification) => {
      console.log("🔔 New notification received:", notification);
      addNotification(notification);
      toast.success(notification.message || "New notification");
    };
    socket.on("new_notification", handleNewNotification);
    
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [user?._id, socket, fetchNotifications, addNotification]);


  const value = {
    notifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
    hasMore,
    loadMoreNotifications,
    isFetching: isFetchingRef.current // Expose the current value of the ref
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};