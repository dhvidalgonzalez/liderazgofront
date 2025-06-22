import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import listUsersService from "src/services/user/user/list";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: listUsersService,
  });

  return (
    <DataContext.Provider
      value={{
        isLoading: usersQuery.isLoading,
        isError: usersQuery.isError,
        users: usersQuery.data || [],
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
