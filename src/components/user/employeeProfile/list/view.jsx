import React, { useState, useMemo } from "react";
import Update from "../update";

/**
 * 💼 Tabla principal de perfiles de empleados
 * Incluye búsqueda, paginación y opción de edición.
 */
const View = ({ employeeProfiles }) => {
  const [search, setSearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 🔍 Filtro de búsqueda (name, rut o gerencia)
  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase();
    return employeeProfiles.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const rut = p.rut?.toLowerCase() || "";
      const gerencia = p.gerencia?.toLowerCase() || "";
      return name.includes(query) || rut.includes(query) || gerencia.includes(query);
    });
  }, [employeeProfiles, search]);

  // 📄 Paginación
  const totalPages = Math.ceil(filteredProfiles.length / pageSize);
  const currentPageData = filteredProfiles.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const renderPageButtons = () => {
    const range = 2;
    const start = Math.max(1, page - range);
    const end = Math.min(totalPages, page + range);
    const buttons = [];

    for (let i = start; i <= end; i++) {
      buttons.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${
            i === page ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Perfiles de Empleados</h5>
            </div>

            <div className="card-body">
              {/* 🔍 Buscador */}
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, RUT o gerencia"
                    className="form-control"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {/* 📋 Tabla de resultados */}
              <div className="table-responsive-sm">
                <table className="table table-sm table-hover text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>RUT</th>
                      <th>Empresa</th>
                      <th>Gerencia</th>
                      <th>Código SAP</th>
                      <th>Activo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name || "—"}</td>
                        <td>{p.rut || "—"}</td>
                        <td>{p.empresa || "—"}</td>
                        <td>{p.gerencia || "—"}</td>
                        <td>{p.sapCode || "—"}</td>
                        <td>
                          <span
                            className={`badge rounded-pill ${
                              p.isActive ? "bg-success" : "bg-secondary"
                            }`}
                          >
                            {p.isActive ? "Sí" : "No"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setSelectedProfile(p)}
                          >
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                        </td>
                      </tr>
                    ))}

                    {currentPageData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-muted">
                          No hay perfiles de empleados para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 🔢 Paginador */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    ⏮
                  </button>
                  {renderPageButtons()}
                  <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    ⏭
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🧾 Modal de actualización */}
          {selectedProfile && (
            <Update
              profile={selectedProfile}
              onClose={() => setSelectedProfile(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
