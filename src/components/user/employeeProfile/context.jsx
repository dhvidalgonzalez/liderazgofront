import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { listEmployeeProfilesService } from "src/services/employeeProfile";

const DataContext = createContext(null);

/**
 * 🧩 DataContextProvider
 * Contexto global para la gestión de perfiles de empleados.
 * Cubre operaciones tipo LIST y UPDATE.
 */
export const DataContextProvider = ({ children }) => {
  const profilesQuery = useQuery({
    queryKey: ["employeeProfiles"],
    queryFn: async () => {
      const data = await listEmployeeProfilesService();
      return data ?? []; // ✅ garantiza que nunca sea undefined
    },
    staleTime: 1000 * 60 * 5, // cache 5 minutos
    retry: 1, // reintenta 1 vez si falla
  });

  return (
    <DataContext.Provider
      value={{
        isLoading: profilesQuery.isLoading,
        isError: profilesQuery.isError,
        employeeProfiles: profilesQuery.data || [], // ✅ fallback seguro
        refetchProfiles: profilesQuery.refetch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/**
 * 🧠 Hook personalizado para acceder al contexto.
 */
export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useDataContext debe usarse dentro de un DataContextProvider");
  }
  return ctx;
};
