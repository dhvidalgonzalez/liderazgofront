import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginBase from "src/components/base/login";
import loginService from "src/services/login/login";
import { useUser } from "src/components/context/UserContext";
import ConfirmChangePasswordModal from "src/components/user/confirmChangePassword/confirmChangePasswordModal";

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

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchSession } = useUser();

  const handleRutChange = (e) => {
    // ✅ mantiene máscara y solo permite dígitos + K
    setRut(formatRut(e.target.value));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const rutRaw = String(rut || "").trim();

    // ✅ bloquear correos / identificadores inválidos
    if (rutRaw.includes("@")) {
      setError("Este sistema solo acepta RUT (no correo). Ej: 11.111.111-1");
      return;
    }

    // ✅ validar DV antes de llamar al backend
    if (!isValidRut(rutRaw)) {
      setError("RUT inválido. Revisa el dígito verificador.");
      return;
    }

    if (!password.trim()) {
      setError("Debes ingresar tu contraseña.");
      return;
    }

    setLoading(true);
    try {
      // ⚠️ enviamos el RUT formateado; el service lo normaliza si corresponde
      const response = await loginService({ rut: rutRaw, clave: password });
      console.log("🚀 ~ handleLogin ~ response:", response);

      // Si el backend pide recambio, abrir modal y no navegar
      // (mantengo tu condición original + compatibilidad si el backend envía otro nombre)
      if (response?.requirePasswordChange || response?.needsPasswordChange) {
        setShowChangeModal(true);
        return;
      }

      if (response?.success) {
        await fetchSession(); // hidrata el contexto con /me
        const redirectTo = location.state?.from?.pathname || "/home";
        navigate(redirectTo, { replace: true });
      } else {
        setError(
          response?.userMessage ||
            response?.error ||
            response?.detalle ||
            "Usuario o contraseña inválidos."
        );
      }
    } catch (err) {
      const data = err?.response?.data || err;

      setError(
        data?.userMessage ||
          data?.error ||
          data?.mensaje ||
          data?.detalle ||
          "Usuario o contraseña inválidos. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginBase>
        <h3 className="fw-bold text-primary">Iniciar Sesión</h3>
        <p className="text-muted">Accede al sistema</p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="rut" className="form-label">
              Usuario:
            </label>
            <input
              id="rut"
              type="text"
              className="form-control"
              placeholder="Ejemplo: 11.111.111-1"
              value={rut}
              onChange={handleRutChange}
              required
              autoComplete="username"
              inputMode="text"
              maxLength={12}
            />
            {/* opcional: feedback suave mientras escribe */}
            {rut.trim().length >= 3 && !rut.includes("@") && !isValidRut(rut) && (
              <small className="text-muted">Revisa el RUT (DV) antes de continuar.</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña:
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? "Accediendo..." : "ACCEDER"}
          </button>

          <div className="text-center mt-3">
            <Link to={"/changePassword"} className="text-decoration-none">
              ¿Olvidó su contraseña?
            </Link>
          </div>
        </form>
      </LoginBase>

      <ConfirmChangePasswordModal
        show={showChangeModal}
        onClose={() => setShowChangeModal(false)}
        rut={rut} // mantenemos el rut con máscara (tal como lo escribió el usuario)
        oldPassword={password}
      />
    </>
  );
};

export default Login;
