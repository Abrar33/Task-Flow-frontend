import { io } from "socket.io-client";
import React, { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
const baseUrl = process.env.API_BASE_URL || "https://task-flow-backend-umber.vercel.app";
  useEffect(() => {
    const s = io(baseUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
