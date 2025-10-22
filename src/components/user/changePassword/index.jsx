import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginBase from "src/components/base/login";
import requestPasswordCodeService from "src/services/login/changePasswordService";

const ChangePassword = () => {
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");
    setLoading(true);

    try {
      const res = await requestPasswordCodeService({ rut });
      const data = res?.data ?? {};
      setOkMsg(data?.message || "Correo enviado con éxito. Revisa tu bandeja.");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 409) {
        setErrMsg(
          data?.error ||
            "Ya existe un código activo. Intenta nuevamente cuando caduque el vigente."
        );
      } else if (status === 502) {
        setErrMsg(
          data?.error ||
            "Error al enviar el correo de recuperación. Inténtalo más tarde."
        );
      } else {
        setErrMsg(data?.error || "No se pudo solicitar el código.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginBase>
      <h3 className="fw-bold text-primary">Recuperar acceso</h3>
      <p className="text-muted mb-3">
        Ingresa tu RUT para enviar el correo de recuperación.
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
            onChange={(e) => setRut(e.target.value)}
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
