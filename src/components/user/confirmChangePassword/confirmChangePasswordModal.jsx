import React from "react";
import ConfirmChangePassword from "./index";

const ConfirmChangePasswordModal = ({ show, onClose, rut, oldPassword }) => {
  if (!show) return null;

  // Evita que el scroll del body quede activo debajo del modal (detalle UX)
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ background: "rgba(0,0,0,.4)" }}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Cambio de contraseña requerido</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <ConfirmChangePassword
                embedded
                initialRut={rut}
                initialOldPassword={oldPassword}
                onSuccess={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmChangePasswordModal;
