import React, { useEffect, useState } from "react";
import Detail from "../detail";
import Update from "../update";
import { statusMap, typeMap } from "src/constants";

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

// En lugar de: props.refetch
const View = ({ justifications, filters, setFilters, applyFilters }) => {
  const [selected, setSelected] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!filters.createdAtStart || !filters.createdAtEnd) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      setFilters((prev) => ({
        ...prev,
        createdAtStart: startDate.toISOString().split("T")[0],
        createdAtEnd: endDate.toISOString().split("T")[0],
      }));
    }
  }, [filters, setFilters]);

  const handleInputChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchClick = () => {
    setPage(1);
    refetch();
  };

  const totalPages = Math.ceil(justifications.length / pageSize);
  const currentPageData = justifications.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const renderPageButtons = () => {
    const range = 2;
    let start = Math.max(1, page - range);
    let end = Math.min(totalPages, page + range);
    if (page <= range) end = Math.min(totalPages, 1 + range * 2);
    else if (page + range >= totalPages)
      start = Math.max(1, totalPages - range * 2);

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
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Justificaciones</h5>
            </div>

            <div className="card-body">
              <p className="text-muted mb-3">
                Buscar por nombre, tipo o fecha.
              </p>
              <div className="row g-2 mb-3">
                <div className="col-md-3">
                  <input
                    type="text"
                    placeholder="Buscar por nombre"
                    className="form-control"
                    value={filters.search}
                    onChange={(e) =>
                      handleInputChange("search", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filters.revisionType}
                    onChange={(e) =>
                      handleInputChange("revisionType", e.target.value)
                    }
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
                    value={filters.createdAtStart}
                    onChange={(e) =>
                      handleInputChange("createdAtStart", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="date"
                    className="form-control"
                    value={filters.createdAtEnd}
                    onChange={(e) =>
                      handleInputChange("createdAtEnd", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-primary w-100"
                    onClick={applyFilters}
                  >
                    Buscar
                  </button>
                </div>
              </div>

              <div className="table-responsive-sm">
                <table className="table table-sm table-hover text-center align-middle">
                  <thead className="">
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
                        <td>{j.employeeName || "—"}</td>
                        <td>{j.employeeRut || "—"}</td>
                        <td>{typeMap[j.type] || j.type}</td>
                        <td>
                          <span className={getEstadoClass(j.status)}>
                            {statusMap[j.status] || j.status}
                          </span>
                        </td>
                        <td className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setSelected(j)}
                          >
                            <i className="bi bi-eye"></i> Ver
                          </button>
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => setUpdateTarget(j)}
                          >
                            <i className="bi bi-pencil-square"></i> Actualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentPageData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-muted">
                          No hay justificaciones para mostrar
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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

          {selected && (
            <Detail
              justification={selected}
              onClose={() => setSelected(null)}
            />
          )}

          {updateTarget && (
            <Update
              justification={updateTarget}
              onClose={() => setUpdateTarget(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default View;
