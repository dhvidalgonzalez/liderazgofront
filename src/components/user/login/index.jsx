import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginBase from "src/components/base/login";
import loginService from "src/services/login/login";
import { useUser } from "src/components/context/UserContext";
import ConfirmChangePasswordModal from "src/components/user/confirmChangePassword/confirmChangePasswordModal";

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchSession } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginService({ rut: rut.trim(), clave: password });
      console.log("🚀 ~ handleLogin ~ response:", response);

      // Si el backend pide recambio, abrir modal y no navegar
      if (response?.requirePasswordChange) {
        setShowChangeModal(true);
        return;
      }

      if (response?.success) {
        await fetchSession(); // hidrata el contexto con /me
        const redirectTo = location.state?.from?.pathname || "/home";
        navigate(redirectTo, { replace: true });
      } else {
        setError(
          response?.error ||
            response?.detalle ||
            "Usuario o contraseña inválidos."
        );
      }
    } catch (err) {
      // apiClient lanza `error.response.data` o `error`
      const payload =
        err && typeof err === "object" ? err : { error: String(err || "") };
      setError(
        payload?.error ||
          payload?.mensaje ||
          payload?.detalle ||
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
              onChange={(e) => setRut(e.target.value)}
              required
              autoComplete="username"
            />
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
        rut={rut}
        oldPassword={password}
      />
    </>
  );
};

export default Login;
