import apiClient from "src/services/apiClient";

const listEmpresasService = async () => {
  return apiClient({
    method: "GET",
    url: "/trabajador/empresas",
  });
};

export default listEmpresasService;
