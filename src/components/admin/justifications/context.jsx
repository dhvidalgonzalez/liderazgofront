import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import listJustificationsService from "src/services/admin/justification/list";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    search: "",
    revisionType: "",
    createdAtStart: "",
    createdAtEnd: "",
  });

  // Inicializa con el rango del último mes
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    return {
      search: "",
      revisionType: "",
      createdAtStart: startDate.toISOString().split("T")[0],
      createdAtEnd: endDate.toISOString().split("T")[0],
    };
  });

  const justificationQuery = useQuery({
    queryKey: ["justifications", appliedFilters],
    queryFn: () => {
      console.log("🔄 Fetching with filters:", appliedFilters); // 👈 útil para depurar
      return listJustificationsService(appliedFilters);
    },
    keepPreviousData: true,
  });

  const applyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const value = useMemo(
    () => ({
      isLoading: justificationQuery.isLoading,
      isError: justificationQuery.isError,
      justifications: justificationQuery.data || [],
      filters,
      setFilters,
      applyFilters,
    }),
    [
      justificationQuery.isLoading,
      justificationQuery.isError,
      justificationQuery.data,
      filters,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
