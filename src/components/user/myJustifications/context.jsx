// src/components/context/DataContext.jsx
import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import listJustificationsService from "src/services/user/justification/list";
import { useUser } from "src/components/context/UserContext";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  const { user } = useUser(); // ✅ obtiene el usuario actual
  const creatorId = user.id;

  const justificationQuery = useQuery({
    queryKey: ["justifications", creatorId],
    queryFn: () => listJustificationsService(creatorId),
    enabled: !!creatorId, // ✅ asegura que no se ejecute si no hay usuario
  });

  return (
    <DataContext.Provider
      value={{
        isLoading: justificationQuery.isLoading,
        isError: justificationQuery.isError,
        justifications: justificationQuery.data || [],
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
