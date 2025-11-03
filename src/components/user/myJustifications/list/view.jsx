import React, { useState } from "react";
import Detail from "../detail";
import Update from "../update";
import { useDataContext } from "../context";

// Badges por estado
const getEstadoClass = (estado) => {
  switch (estado) {
    case "PENDING":
      return "badge bg-warning text-dark";
    case "APPROVED":
      return "badge bg-success";
    case "REJECTED":
      return "badge bg-danger";
    default:
      return "badge bg-secondary";
  }
};

const typeMap = {
  VACATION: "Vacaciones",
  COMISION: "Comisión",
  ACTIVIDAD: "Actividad",
  MEDICAL: "Médica",
  LEGAL: "Legal",
  OTHER: "Otra",
};

const statusMap = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const View = ({ justifications }) => {
  const [selected, setSelected] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [revisionFilter, setRevisionFilter] = useState("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ✅ conexión con el contexto
  const { updateFilters, refetch, isLoading } = useDataContext();

  const handleSearch = () => {
    updateFilters({ startDate: startDateFrom, endDate: startDateTo });
    refetch(); // 🔄 fuerza la consulta al backend
  };

  const handleClear = () => {
    setSearch("");
    setRevisionFilter("");
    setStartDateFrom("");
    setStartDateTo("");
    updateFilters({ startDate: "", endDate: "" });
    refetch(); // 🔄 recarga sin filtros
    setPage(1);
  };

  // 🔍 filtrado local (nombre y tipo de revisión)
  const filtered = (justifications || []).filter((j) => {
    const name = j.employeeNombre || "";
    const revision = j.reviewerId ? "manual" : "automatica";
    const passesSearch = name.toLowerCase().includes(search.toLowerCase());
    const passesRevision = revisionFilter === "" || revision === revisionFilter;
    return passesSearch && passesRevision;
  });

  // 🔹 paginación local
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentPageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const renderPageButtons = () => {
    const range = 2;
    let start = Math.max(1, page - range);
    let end = Math.min(totalPages, page + range);
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
          <div className="card shadow-sm">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Justificaciones</h5>
            </div>

            <div className="card-body">
              <p className="text-muted mb-3">Buscar por nombre o rango de fechas.</p>

              {/* 🔍 filtros */}
              <div className="row g-2 mb-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre"
                    className="form-control"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={revisionFilter}
                    onChange={(e) => {
                      setRevisionFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">Todas las revisiones</option>
                    <option value="manual">Revisión manual</option>
                    <option value="automatica">Revisión automática</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={startDateFrom}
                    onChange={(e) => setStartDateFrom(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={startDateTo}
                    onChange={(e) => setStartDateTo(e.target.value)}
                  />
                </div>
                <div className="col-md-2 d-flex gap-2">
                  <button
                    className="btn btn-success w-100"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? "Buscando..." : "Buscar"}
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={handleClear}
                    disabled={isLoading}
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {/* 📋 tabla */}
              <div className="table-responsive-sm">
                <table className="table table-sm table-hover text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>RUT</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageData.map((j) => (
                      <tr key={j.id}>
                        <td>{j.employeeNombre || "—"}</td>
                        <td>{j.employeeRut || "—"}</td>
                        <td>{typeMap[j.type] || j.type}</td>
                        <td>
                          <span className={getEstadoClass(j.status)}>
                            {statusMap[j.status] || j.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm rounded-pill"
                            onClick={() => setSelected(j)}
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentPageData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-muted">
                          No hay justificaciones para mostrar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* 🔹 paginación local */}
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
            </div>
          </div>

          {/* Modales */}
          {selected && <Detail justification={selected} onClose={() => setSelected(null)} />}
          {updateTarget && <Update justification={updateTarget} onClose={() => setUpdateTarget(null)} />}
        </div>
      </div>
    </div>
  );
};

export default View;
