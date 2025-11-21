import React, { createContext, useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import listJustificationsService from "src/services/admin/justification/list";

const DataContext = createContext(null);

export const DataContextProvider = ({ children }) => {
  // 🔹 Filtros activos en el formulario
  const [filters, setFilters] = useState({
    search: "",
    revisionType: "", // "" | "manual" | "automatica" (filtro solo local)
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

  // 🔹 Paginación de servidor
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const justificationQuery = useQuery({
    queryKey: ["admin-justifications", appliedFilters, page, pageSize],
    queryFn: async () => {
      const result = await listJustificationsService({
        ...appliedFilters,
        page,
        pageSize,
      });

      // Normalizamos la forma { data, pagination }
      if (Array.isArray(result)) {
        return {
          data: result,
          pagination: {
            page,
            pageSize,
            totalItems: result.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      return {
        data: result?.data || [],
        pagination:
          result?.pagination || {
            page,
            pageSize,
            totalItems: (result?.data || []).length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
      };
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  // 🔹 Aplica filtros (dispara el refetch y resetea la página)
  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const value = useMemo(() => {
    const payload = justificationQuery.data || {
      data: [],
      pagination: {
        page,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };

    return {
      isLoading: justificationQuery.isLoading,
      isError: justificationQuery.isError,
      justifications: payload.data || [],
      pagination: payload.pagination,
      totalItems: payload.pagination?.totalItems ?? (payload.data || []).length,
      page,
      setPage,
      pageSize,
      setPageSize,
      filters,
      appliedFilters,
      setFilters,
      applyFilters,
      refetch: justificationQuery.refetch,
    };
  }, [
    justificationQuery.isLoading,
    justificationQuery.isError,
    justificationQuery.data,
    filters,
    appliedFilters,
    page,
    pageSize,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
