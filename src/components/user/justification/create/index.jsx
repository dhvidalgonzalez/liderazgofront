import React from "react";
import View from "./view";
import { useDataContext } from "../context"; // nuevo contexto genérico

const CreateForm = () => {
  const { users, isLoading, isError } = useDataContext();

  if (isLoading) return <div>Cargando usuarios...</div>;
  if (isError) return <div>Error al cargar usuarios</div>;

  return <View users={users} />;
};

export default CreateForm;
