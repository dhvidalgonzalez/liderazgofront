import React, { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  listEmployeeProfilesPagedService,
  // Dejo el import a mano si lo necesitas en otro lado:
  // listEmployeeProfilesService,
} from "src/services/admin/employeeProfile";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  // Estado de paginación/orden/búsqueda
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({
    isActive: undefined,
    empresa: undefined,
    gerencia: undefined,
  });

  const queryParams = useMemo(
    () => ({
      page,
      pageSize,
      q,
      sortBy,
      sortOrder,
      isActive: filters.isActive,
      empresa: filters.empresa,
      gerencia: filters.gerencia,
    }),
    [page, pageSize, q, sortBy, sortOrder, filters.isActive, filters.empresa, filters.gerencia]
  );

  const profilesQuery = useQuery({
    queryKey: ["employeeProfiles", queryParams],
    queryFn: async () => {
      const payload = await listEmployeeProfilesPagedService(queryParams);

      const data = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : [];

      const pagination =
        payload?.pagination || {
          page,
          pageSize,
          totalItems: data.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        };

      return { data, pagination };
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const setQueryParams = (partial = {}) => {
    if (partial.page != null) setPage(partial.page);
    if (partial.pageSize != null) setPageSize(partial.pageSize);
    if (partial.q != null) setQ(partial.q);
    if (partial.sortBy != null) setSortBy(partial.sortBy);
    if (partial.sortOrder != null) setSortOrder(partial.sortOrder);

    if (
      Object.prototype.hasOwnProperty.call(partial, "isActive") ||
      Object.prototype.hasOwnProperty.call(partial, "empresa") ||
      Object.prototype.hasOwnProperty.call(partial, "gerencia")
    ) {
      setFilters((prev) => ({
        ...prev,
        ...(Object.prototype.hasOwnProperty.call(partial, "isActive")
          ? { isActive: partial.isActive }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(partial, "empresa")
          ? { empresa: partial.empresa }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(partial, "gerencia")
          ? { gerencia: partial.gerencia }
          : {}),
      }));
    }
  };

  const goToNextPage = () => {
    const totalPages = profilesQuery.data?.pagination?.totalPages || 1;
    setPage((p) => Math.min(p + 1, totalPages));
  };

  const goToPrevPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };

  return (
    <DataContext.Provider
      value={{
        // Compatibilidad
        isLoading: profilesQuery.isLoading,
        isError: profilesQuery.isError,
        employeeProfiles: profilesQuery.data?.data || [],
        refetchProfiles: profilesQuery.refetch,

        // Nuevos (paginación/orden/búsqueda)
        pagination: profilesQuery.data?.pagination,
        page,
        setPage,
        pageSize,
        setPageSize,
        q,
        setQ,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        filters,
        setFilters,
        setQueryParams,
        goToNextPage,
        goToPrevPage,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useDataContext debe usarse dentro de un DataContextProvider");
  }
  return ctx;
};
