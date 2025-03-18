"use client";

import React, { useState, useContext, createContext } from "react";

// Define the type for the context value
interface MyContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with a default value of `null`
const MyContext = createContext<MyContextType | null>(null);

// Context Provider Component
export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MyContext.Provider
      value={{
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook for consuming the context
export function useMyContext(): MyContextType {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a Context provider");
  }
  return context;
}
