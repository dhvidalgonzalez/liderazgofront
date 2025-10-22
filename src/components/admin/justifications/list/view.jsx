import React, { useEffect, useMemo, useState } from "react";
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

const View = ({
  justifications,
  filters,
  setFilters,
  applyFilters,
}) => {
  const [selected, setSelected] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Inicializa rango de fechas (último mes)
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

  // ✅ Filtro local (nombre y revisión)
  const locallyFiltered = useMemo(() => {
    let data = [...justifications];
    const q = (filters.search || "").toLowerCase().trim();

    if (q) {
      data = data.filter((j) =>
        (j.employeeNombre || "").toLowerCase().includes(q)
      );
    }

    if (filters.revisionType) {
      data = data.filter((j) =>
        filters.revisionType === "manual" ? j.reviewerId : !j.reviewerId
      );
    }

    // ✅ Filtro por fecha local
    const from = filters.createdAtStart
      ? new Date(filters.createdAtStart)
      : null;
    const to = filters.createdAtEnd ? new Date(filters.createdAtEnd) : null;

    if (from || to) {
      data = data.filter((j) => {
        const created = new Date(j.createdAt);
        return (!from || created >= from) && (!to || created <= to);
      });
    }

    return data;
  }, [justifications, filters]);

  // ✅ Paginación local
  const totalPages = Math.max(1, Math.ceil(locallyFiltered.length / pageSize));
  const currentPageData = useMemo(() => {
    const ps = pageSize || 10;
    return locallyFiltered.slice((page - 1) * ps, page * ps);
  }, [locallyFiltered, page, pageSize]);

  const buildPagination = (current, total, siblings = 1) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const first = 1;
    const last = total;
    const start = Math.max(first + 1, current - siblings);
    const end = Math.min(last - 1, current + siblings);
    const items = [first];
    if (start > first + 1) items.push("start-ellipsis");
    for (let i = start; i <= end; i++) items.push(i);
    if (end < last - 1) items.push("end-ellipsis");
    if (last !== first) items.push(last);
    return items.filter((v, i, a) => a.indexOf(v) === i);
  };

  const pageItems = buildPagination(page, totalPages, 1);

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Justificaciones (Administrador)</h5>
            </div>

            <div className="card-body">
              <p className="text-muted mb-3">
                Buscar por nombre, tipo o fecha.
              </p>

              {/* 🔹 Filtros */}
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
                    className="btn btn-success w-100"
                    onClick={applyFilters}
                  >
                    Buscar
                  </button>
                </div>
              </div>

              {/* 🔹 Selector por página */}
              <div className="d-flex justify-content-end mb-3">
                <div className="d-inline-flex align-items-center gap-2 bg-light border rounded-pill px-3 py-1 shadow-sm">
                  <span className="text-muted small fw-semibold">
                    Por página:
                  </span>
                  <select
                    className="form-select form-select-sm border-0 bg-transparent fw-semibold"
                    style={{ width: "70px", boxShadow: "none" }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* 🔹 Tabla */}
              {currentPageData.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                  No hay justificaciones para mostrar.
                </div>
              ) : (
                <div className="table-responsive-sm mb-4">
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
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-pill"
                                onClick={() => setSelected(j)}
                              >
                                Ver
                              </button>
                              <button
                                className="btn btn-outline-success btn-sm rounded-pill"
                                onClick={() => setUpdateTarget(j)}
                              >
                                Actualizar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 🔹 Paginador local */}
              {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-center align-items-center flex-wrap gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    title="Primera página"
                  >
                    ⏮
                  </button>

                  {pageItems.map((item, idx) =>
                    typeof item === "number" ? (
                      <button
                        key={`p-${item}`}
                        className={`btn btn-sm rounded-pill ${
                          item === page
                            ? "btn-primary text-white"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </button>
                    ) : (
                      <span
                        key={`e-${idx}`}
                        className="px-2 text-muted"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    )
                  )}

                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    title="Última página"
                  >
                    ⏭
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 🔹 Modales */}
          {selected && (
            <Detail justification={selected} onClose={() => setSelected(null)} />
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
