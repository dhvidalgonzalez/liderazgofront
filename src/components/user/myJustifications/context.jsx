import React, { createContext, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import listJustificationsService from "src/services/user/justification/list";

const DataContext = createContext(null);

/**
 * 📦 DataContextProvider
 * Gestiona las justificaciones del usuario autenticado.
 * - Usa React Query para obtener datos del backend.
 * - Permite actualizar filtros dinámicamente (rango de fechas).
 */
export const DataContextProvider = ({ children }) => {
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  // Hook de consulta — se vuelve a ejecutar cuando cambian los filtros
  const justificationQuery = useQuery({
    queryKey: ["justifications", filters],
    queryFn: () => listJustificationsService(filters),
  });

  // Función para actualizar los filtros (desde View)
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <DataContext.Provider
      value={{
        justifications: justificationQuery.data || [],
        isLoading: justificationQuery.isLoading,
        isError: justificationQuery.isError,
        refetch: justificationQuery.refetch,
        filters,
        updateFilters,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
