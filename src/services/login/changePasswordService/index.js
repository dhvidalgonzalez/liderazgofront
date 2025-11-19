import apiClient from "src/services/apiClient";

const normalizeRut = (rut) =>
  String(rut || "").trim().replace(/\./g, "").toUpperCase();

const requestPasswordCodeService = async ({ rut }) => {
  const res = await apiClient({
    method: "POST",
    url: "/login/change-password/request-code",
    data: { rut: normalizeRut(rut) },
  });
  console.log("🚀 ~ requestPasswordCodeService ~ res:", res)
  // Devolvemos el payload “tal cual” para que el componente decida el mensaje
  return res?.data ?? res;
};

export default requestPasswordCodeService;
