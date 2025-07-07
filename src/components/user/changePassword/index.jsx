import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginBase from "src/components/base/login";

const ChangePassword = () => {
  const [user, setUser] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Usuario:", user);
    console.log("Nueva contraseña:", password1);
    console.log("Confirmación:", password2);
    alert("✅ Cambio de contraseña simulado correctamente.");
  };

  return (
    <LoginBase>
      <h3 className="fw-bold text-primary">Cambiar Contraseña</h3>
      <p className="text-muted">
        Ingrese sus datos para establecer una nueva contraseña
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user" className="form-label">
            RUT o Correo electrónico:
          </label>
          <input
            id="user"
            type="text"
            className="form-control"
            placeholder="Ejemplo: 11.111.111-1 o usuario@correo.cl"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password1" className="form-label">
            Nueva Contraseña:
          </label>
          <input
            id="password1"
            type="password"
            className="form-control"
            placeholder="Ingrese su nueva contraseña"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-2">
          CAMBIAR CONTRASEÑA
        </button>

        <div className="text-center mt-3">
          <Link to={"/login"} className="text-decoration-none">
            Ingresar
          </Link>
        </div>
      </form>
    </LoginBase>
  );
};

export default ChangePassword;
