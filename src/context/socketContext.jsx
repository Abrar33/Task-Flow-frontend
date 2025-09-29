import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      const s = io("http://localhost:3000", { query: { userId: user._id } });
      window.socket = s; // ✅ For debugging
      setSocket(s);

      s.emit("joinUser", user._id);

      return () => {
        s.emit("leaveUser", user._id);
        s.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  // ⏳ Don’t render children until socket is ready
  if (user && !socket) return null;

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
