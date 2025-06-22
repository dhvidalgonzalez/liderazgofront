import React from "react";
import View from "./view";
import { useDataContext } from "../context";

const List = () => {
  const { justifications, isLoading, isError } = useDataContext();
  console.log("🚀 ~ List ~ justifications:", justifications);

  if (isLoading) {
    return <div className="alert alert-info">Cargando justificaciones...</div>;
  }

  if (isError) {
    return <div className="alert alert-danger">Error al cargar los datos.</div>;
  }

  return <View justifications={justifications} />;
};

export default List;
