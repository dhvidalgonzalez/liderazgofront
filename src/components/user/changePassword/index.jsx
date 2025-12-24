import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginBase from "src/components/base/login";
import requestPasswordCodeService from "src/services/login/changePasswordService";

// ============================================================
// 🧩 Helpers RUT (máscara + validación DV)
// ============================================================
const cleanRut = (value) => (value || "").replace(/[^0-9kK]/g, "").toUpperCase();

const formatRut = (value) => {
  const clean = cleanRut(value);
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

const rutDv = (body) => {
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const mod = 11 - (sum % 11);
  if (mod === 11) return "0";
  if (mod === 10) return "K";
  return String(mod);
};

const isValidRut = (rutFormatted) => {
  const c = cleanRut(rutFormatted);
  if (c.length < 2) return false;
  const body = c.slice(0, -1);
  const dv = c.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  return rutDv(body) === dv;
};

const ChangePassword = () => {
  const [rut, setRut] = useState("");
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleRutChange = (e) => setRut(formatRut(e.target.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOkMsg("");
    setErrMsg("");

    const raw = String(rut || "").trim();

    // ✅ bloquear correos
    if (raw.includes("@")) {
      setErrMsg("Este sistema solo acepta RUT (no correo). Ej: 11.111.111-1");
      return;
    }

    // ✅ validar DV antes de llamar al backend
    if (!isValidRut(raw)) {
      setErrMsg("RUT inválido. Revisa el dígito verificador.");
      return;
    }

    setLoading(true);
    try {
      const data = await requestPasswordCodeService({ rut: raw });

      if (data?.success) {
        if (data.errorCode === "CODE_ALREADY_SENT" || data.codeAlreadySent) {
          const v = data.vigencia ? ` hasta ${data.vigencia}` : "";
          setOkMsg(`Ya existe un código vigente${v}. Revisa tu correo (y SPAM).`);
        } else {
          setOkMsg(data.userMessage || "Código enviado. Revisa tu correo (y SPAM).");
        }
        return;
      }

      const code = data?.errorCode || "UNKNOWN_ERROR";

      if (code === "INVALID_IDENTIFIER") {
        setErrMsg("Este sistema solo acepta RUT. Ej: 11.111.111-1");
      } else if (code === "RUT_NOT_REGISTERED" || code === "RUT_NOT_FOUND_OR_INACTIVE") {
        setErrMsg("Ese RUT no está registrado o la cuenta está inactiva.");
      } else if (code === "NO_EMAIL_ON_FILE") {
        setErrMsg("No existe un correo vigente asociado a este RUT. Contacta soporte.");
      } else if (code === "APIUNI_UNAVAILABLE" || code === "CONNECTION_ERROR") {
        setErrMsg("Servicio temporalmente no disponible. Intenta más tarde.");
      } else {
        setErrMsg(
          data?.userMessage ||
            "No se pudo solicitar el código de recuperación. Intenta nuevamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
            autoComplete="username"
            inputMode="text"
          />
          {rut.trim().length >= 3 && !rut.includes("@") && !isValidRut(rut) && (
            <small className="text-muted">Revisa el RUT (DV) antes de continuar.</small>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={loading || !rut.trim()}
        >
          {loading ? "Enviando..." : "ENVIAR CORREO DE RECUPERACIÓN"}
        </button>

        <div className="text-center mt-3">
          <Link to="/changePassword/confirm" className="text-decoration-none">
            Acceder con clave temporal
          </Link>
        </div>
      </form>
    </LoginBase>
  );
};

export default ChangePassword;
