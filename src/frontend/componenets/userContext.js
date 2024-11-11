// UserContext.js
import React, { createContext, useContext, useState } from "react";

// Create the User Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Initialize user data

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook for using the User Context
export const useUser = () => useContext(UserContext);
