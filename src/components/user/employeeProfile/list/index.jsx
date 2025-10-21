import React from "react";
import View from "./view";
import { useDataContext } from "../context";

const List = () => {
  const { employeeProfiles, isLoading, isError } = useDataContext();

  if (isLoading)
    return (
      <div className="alert alert-primary text-center">
        Cargando perfiles de empleados...
      </div>
    );

  if (isError)
    return (
      <div className="alert alert-danger text-center">
        Error al cargar los perfiles de empleados.
      </div>
    );

  return <View employeeProfiles={employeeProfiles} />;
};

export default List;
