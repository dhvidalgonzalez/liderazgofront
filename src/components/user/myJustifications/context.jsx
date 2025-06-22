import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import listJustificationsService from "src/services/user/justification/list";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  const justificationQuery = useQuery({
    queryKey: ["justifications"],
    queryFn: listJustificationsService,
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
