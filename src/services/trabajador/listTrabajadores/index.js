import apiClient from "src/services/apiClient";

const listTrabajadoresService = async (data = {}) => {
  return apiClient({
    method: "POST",
    url: "/trabajador/trabajadores",
    data, // 👈 usamos el cuerpo del POST
  });
};


export default listTrabajadoresService;
