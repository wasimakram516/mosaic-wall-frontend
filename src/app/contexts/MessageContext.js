"use client";
import React, { createContext, useState, useContext } from "react";
import { Snackbar, Alert } from "@mui/material";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = (text, severity = "error") => {
    setMessage({ text, severity });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleClose = () => {
    setMessage(null);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={Boolean(message)}
        onClose={handleClose}
        autoHideDuration={5000}
      >
        {message && (
          <Alert variant="filled" severity={message.severity}>
            {message.text}
          </Alert>
        )}
      </Snackbar>
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
