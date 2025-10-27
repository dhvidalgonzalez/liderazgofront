import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginBase from "src/components/base/login";
import requestPasswordCodeService from "src/services/login/changePasswordService";

const ChangePassword = () => {
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // ============================================================
  // 🧩 Máscara automática de RUT
  // ============================================================
  const formatRut = (value) => {
    const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (!clean) return "";
    let body = clean.slice(0, -1);
    let dv = clean.slice(-1);
    let formatted = "";
    while (body.length > 3) {
      formatted = "." + body.slice(-3) + formatted;
      body = body.slice(0, -3);
    }
    formatted = body + formatted;
    return `${formatted}-${dv}`;
  };

  const handleRutChange = (e) => {
    setRut(formatRut(e.target.value));
  };

  // ============================================================
  // 🚀 Enviar solicitud de recuperación
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");
    setLoading(true);

    try {
      const res = await requestPasswordCodeService({ rut });
      const data = res?.data ?? res ?? {};

      // ✅ Si el backend responde con éxito
      if (data.success) {
        const detalle = data.detalle?.includes("Código generado")
          ? data.detalle
          : "Correo enviado con éxito. Revisa tu bandeja de entrada.";
        setOkMsg(detalle);
      } else {
        // ⚠️ Si el backend indica error, mostramos mensaje específico
        let msg = data.detalle || data.mensaje;

        if (!msg && data.vigencia)
          msg = `Ya existe un código vigente hasta ${data.vigencia}.`;

        if (!msg) msg = "No se pudo solicitar el código de recuperación.";

        // Muestra errores conocidos más amigables
        if (/ya existe/i.test(msg))
          msg = "Ya existe un código vigente. Intenta más tarde.";
        else if (/correo/i.test(msg))
          msg = "No se encontró un correo registrado para este usuario.";
        else if (/no se generó/i.test(msg))
          msg = "El sistema no pudo generar un código. Intenta más tarde.";

        setErrMsg(msg);
      }
    } catch (err) {
      const data = err?.response?.data || {};
      const detalle =
        data?.detalle ||
        data?.mensaje ||
        "No se pudo contactar con el servidor. Verifica tu conexión.";
      setErrMsg(detalle);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 🖼️ Render
  // ============================================================
  return (
    <LoginBase>
      <h3 className="fw-bold text-primary">Recuperar acceso</h3>
      <p className="text-muted mb-3">
        Ingresa tu RUT para solicitar el código de recuperación de contraseña.
      </p>

      {okMsg && <div className="alert alert-success">{okMsg}</div>}
      {errMsg && <div className="alert alert-danger">{errMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="rut" className="form-label">
            RUT:
          </label>
          <input
            id="rut"
            type="text"
            className="form-control"
            placeholder="11.111.111-1"
            value={rut}
            onChange={handleRutChange}
            maxLength={12}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={loading || !rut.trim()}
        >
          {loading ? "Enviando..." : "ENVIAR CORREO DE RECUPERACIÓN"}
        </button>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">
            Volver a ingresar
          </Link>
        </div>
      </form>
    </LoginBase>
  );
};

export default ChangePassword;
