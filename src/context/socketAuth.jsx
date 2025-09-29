import { io } from "socket.io-client";
import React, { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io("http://localhost:3000", {
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
