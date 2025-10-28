// src/components/login/ConfirmChangePassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginBase from "src/components/base/login";

// 👇 NUEVOS servicios separados
import temporalPasswordService from "src/services/login/temporalPasswordService";
import confirmPasswordService from "src/services/login/confirmPasswordService";

// Máscara automática de RUT (con puntos y guion)
const formatRut = (value) => {
  const clean = String(value || "").replace(/[^0-9kK]/g, "").toUpperCase();
  if (!clean) return "";
  let body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let formatted = "";
  while (body.length > 3) {
    formatted = "." + body.slice(-3) + formatted;
    body = body.slice(0, -3);
  }
  formatted = body + formatted;
  return `${formatted}-${dv}`;
};

// Política igual que backend: 8+ chars, 1 mayús, 1 minús, 1 número y un especial . , ; : * / + - = @ # $
const PASSWORD_POLICY =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,;:*\/+\-=@#$])[A-Za-z\d.,;:*\/+\-=@#$]+$/;

const ConfirmChangePassword = () => {
  const [rut, setRut] = useState("");
  const [oldPassword, setOldPassword] = useState(""); // clave actual/temporal
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleRutChange = (e) => setRut(formatRut(e.target.value));

  const validateFrontend = () => {
    if (!rut.trim()) return "El RUT es requerido.";
    if (!oldPassword) return "Debes ingresar tu clave actual/temporal.";
    if (!newPassword) return "Debes ingresar la nueva contraseña.";
    if (newPassword.length < 8)
      return "La nueva contraseña debe tener al menos 8 caracteres.";
    if (!PASSWORD_POLICY.test(newPassword))
      return "La nueva contraseña debe tener 1 mayúscula, 1 minúscula, 1 número y un caracter especial . , ; : * / + - = @ # $.";
    if (newPassword !== newPassword2) return "Las contraseñas no coinciden.";
    if (newPassword === oldPassword)
      return "La nueva contraseña no puede ser igual a la anterior.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");

    const validationError = validateFrontend();
    if (validationError) {
      setErrMsg(validationError);
      return;
    }

    setLoading(true);
    try {
      // 1) Validar clave temporal/actual
      const resValidate = await temporalPasswordService({
        rut,
        tempPassword: oldPassword,
      });
      const dataValidate = resValidate?.data ?? resValidate ?? {};

      if (!dataValidate?.success) {
        const msg =
          dataValidate?.mensaje ||
          dataValidate?.error ||
          "No se pudo validar la clave temporal.";
        setErrMsg(
          /clave.*inválida/i.test(msg)
            ? "La clave actual/temporal no es correcta."
            : msg
        );
        return;
      }

      // 2) Confirmar nueva clave
      const resConfirm = await confirmPasswordService({
        rut,
        newPassword,
      });
      const dataConfirm = resConfirm?.data ?? resConfirm ?? {};

      if (dataConfirm?.success) {
        setOkMsg(dataConfirm?.message || "Contraseña actualizada con éxito.");
        setOldPassword("");
        setNewPassword("");
        setNewPassword2("");
      } else {
        const msg =
          dataConfirm?.detalle ||
          dataConfirm?.mensaje ||
          dataConfirm?.error ||
          "No se pudo actualizar la contraseña.";
        if (/igual a anterior/i.test(msg)) {
          setErrMsg("La nueva contraseña no puede ser igual a la anterior.");
        } else if (/no cumple requisitos/i.test(msg)) {
          setErrMsg(
            "La nueva contraseña no cumple los requisitos: 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y un caracter especial . , ; : * / + - = @ # $."
          );
        } else {
          setErrMsg(msg);
        }
      }
    } catch (err) {
      const data = err?.response?.data || {};
      const detalle =
        data?.detalle ||
        data?.mensaje ||
        data?.error ||
        "No se pudo contactar con el servidor. Verifica tu conexión.";
      setErrMsg(detalle);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginBase>
      <h3 className="fw-bold text-primary">Confirmar cambio de contraseña</h3>
      <p className="text-muted mb-3">
        Ingresa tu RUT, tu clave actual/temporal y define tu nueva contraseña.
      </p>

      {okMsg && <div className="alert alert-success">{okMsg}</div>}
      {errMsg && <div className="alert alert-danger">{errMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="rut" className="form-label">RUT</label>
          <input
            id="rut"
            type="text"
            className="form-control"
            placeholder="11.111.111-1"
            value={rut}
            onChange={handleRutChange}
            maxLength={12}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">
            Clave actual / temporal
          </label>
          <input
            id="oldPassword"
            type="password"
            className="form-control"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <small className="text-muted">
            Debe incluir 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número y un
            caracter especial . , ; : * / + - = @ # $
          </small>
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword2" className="form-label">
            Repetir nueva contraseña
          </label>
          <input
            id="newPassword2"
            type="password"
            className="form-control"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={loading}
        >
          {loading ? "Procesando..." : "CONFIRMAR CAMBIO DE CONTRASEÑA"}
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

export default ConfirmChangePassword;
