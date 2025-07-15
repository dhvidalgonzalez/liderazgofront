import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginBase from "src/components/base/login";
import loginService from "src/services/login/login";

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginService({ rut, clave: password });
      console.log("✅ Login exitoso:", response);

      // ✅ Redirige a home si el login fue exitoso
      navigate("/home");
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      setError("Usuario o contraseña inválidos. Intente nuevamente.");
    }
  };

  return (
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
          />
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100 mt-2">
          ACCEDER
        </button>

        <div className="text-center mt-3">
          <Link to={"/changePassword"} className="text-decoration-none">
            ¿Olvidó su contraseña?
          </Link>
        </div>
      </form>
    </LoginBase>
  );
};

export default Login;
