import React, { createContext, useContext, useState } from 'react';

// Create a context for the email address
const EmailContext = createContext();

// Custom hook to use the email context
export const useEmail = () => useContext(EmailContext);

// Provider component to set and provide the email address
export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};