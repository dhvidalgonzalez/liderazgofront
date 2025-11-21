import React from "react";
import View from "./view";
import { useDataContext } from "../context";

const List = () => {
  const {
    justifications,
    isLoading,
    isError,
    filters,
    appliedFilters,
    setFilters,
    applyFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    pagination,
    totalItems,
  } = useDataContext();

  if (isLoading) {
    return <div className="alert alert-primary">Cargando justificaciones...</div>;
  }

  if (isError) {
    return <div className="alert alert-danger">Error al cargar los datos.</div>;
  }

  return (
    <View
      justifications={justifications}
      filters={filters}
      appliedFilters={appliedFilters}
      setFilters={setFilters}
      applyFilters={applyFilters}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
      setPageSize={setPageSize}
      pagination={pagination}
      totalItems={totalItems}
    />
  );
};

export default List;
