import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useMediaSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [newMediaCount, setNewMediaCount] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = () => {
      try {
        // Replace with your actual backend URL
        const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_HOST;

        const newSocket = io(socketUrl, {
          transports: ["websocket", "polling"],
          timeout: 30000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection event handlers
        newSocket.on("connect", () => {
          console.log("✅ Socket connected:", newSocket.id);
          setConnected(true);
          setConnectionError(null);
          setNewMediaCount(0);
        });

        newSocket.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error);
          setConnected(false);
          setConnectionError(error.message);
        });

        newSocket.on("disconnect", (reason) => {
          console.log("🔌 Socket disconnected:", reason);
          setConnected(false);

          // Auto-reconnect if server disconnected
          if (reason === "io server disconnect") {
            setTimeout(() => {
              newSocket.connect();
            }, 1000);
          }
        });

        newSocket.on("reconnect", (attemptNumber) => {
          console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
          setConnected(true);
          setConnectionError(null);
        });

        newSocket.on("reconnect_error", (error) => {
          console.error("❌ Reconnection failed:", error);
          setConnectionError("Reconnection failed");
        });

        // Register as admin client for all media updates
        newSocket.emit("register", "admin");

        return newSocket;
      } catch (error) {
        console.error("❌ Failed to initialize socket:", error);
        setConnectionError(error.message);
        return null;
      }
    };

    const newSocket = initSocket();

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        console.log("🧹 Cleaning up socket connection");
        newSocket.disconnect();
      }
    };
  }, []);

  // Function to reset new media count
  const resetNewMediaCount = () => {
    setNewMediaCount(0);
  };

  // Function to increment new media count
  const incrementNewMediaCount = () => {
    setNewMediaCount((prev) => prev + 1);
  };

  // Function to manually request media refresh
  const requestMediaRefresh = () => {
    if (socket && connected) {
      socket.emit("requestMediaRefresh");
    }
  };

  return {
    socket,
    connected,
    newMediaCount,
    connectionError,
    resetNewMediaCount,
    incrementNewMediaCount,
    requestMediaRefresh,
  };
};

export default useMediaSocket;
