import React, { useState } from "react";
import LoginBase from "src/components/base/login";

const Login = () => {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("RUT:", rut, "Password:", password);
  };

  return (
    <LoginBase>
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

        <button type="submit" className="btn btn-primary w-100 mt-2">
          ACCEDER
        </button>

        <div className="text-center mt-3">
          <a href="#" className="small text-decoration-none">
            ¿Olvidó su contraseña?
          </a>
        </div>
      </form>
    </LoginBase>
  );
};

export default Login;
