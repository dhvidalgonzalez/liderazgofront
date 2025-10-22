import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import listJustificationsService from "src/services/admin/justification/list";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  // 🔹 Filtros activos en el formulario
  const [filters, setFilters] = useState({
    search: "",
    revisionType: "",
    createdAtStart: "",
    createdAtEnd: "",
  });

  // 🔹 Filtros aplicados (último mes por defecto)
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

  // 🔹 Query de justificaciones (admin)
  const justificationQuery = useQuery({
    queryKey: ["admin-justifications", appliedFilters],
    queryFn: async () => {
      const res = await listJustificationsService(appliedFilters);
      // El backend ya devuelve un arreglo directo
      return Array.isArray(res) ? res : res?.data || [];
    },
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  });

  // 🔹 Aplica filtros (dispara el refetch)
  const applyFilters = () => setAppliedFilters({ ...filters });

  const value = useMemo(
    () => ({
      isLoading: justificationQuery.isLoading,
      isError: justificationQuery.isError,
      justifications: justificationQuery.data || [],
      filters,
      setFilters,
      applyFilters,
      refetch: justificationQuery.refetch,
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
