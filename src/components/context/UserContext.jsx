// src/components/context/UserProviderStatic.jsx

import React, { createContext, useContext } from "react";

// 🧪 Usuario de prueba
const mockUser = {
  name: "David",
  lastName: "Vidal",
  email: "david.vidal@example.com",
  rut: "12.345.678-9",
};

// 🎯 Contexto y proveedor
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  return (
    <UserContext.Provider value={{ user: mockUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserContext };
