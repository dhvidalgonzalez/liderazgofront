import React from "react";
import View from "./view";
import { useDataContext } from "../context";

const List = () => {
  const {
    justifications,
    isLoading,
    isError,
    filters,
    setFilters,
    applyFilters, // ✅ usamos applyFilters
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
      setFilters={setFilters}
      applyFilters={applyFilters}
    />
  );
};

export default List;
