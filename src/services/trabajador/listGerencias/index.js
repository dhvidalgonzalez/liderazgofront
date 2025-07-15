import apiClient from "src/services/apiClient";

const listGerenciasService = async () => {
  return apiClient({
    method: "GET",
    url: "/trabajador/gerencias",
  });
};

export default listGerenciasService;
