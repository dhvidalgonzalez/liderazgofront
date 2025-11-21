import React, { useEffect, useMemo, useState } from "react";
import Detail from "../detail";
import Update from "../update";
import { statusMap, typeMap } from "src/constants";
import exportJustificationsExcelService from "src/services/admin/justification/exportJustificationsExcelService";

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
  appliedFilters,
  setFilters,
  applyFilters,
  page,
  setPage,
  pageSize,
  setPageSize,
  pagination,
  totalItems,
}) => {
  const [selected, setSelected] = useState(null);
  const [updateTarget, setUpdateTarget] = useState(null);

  const totalPages = Math.max(1, pagination?.totalPages || 1);
  const currentPage = pagination?.page || page || 1;

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
    // la página de servidor se resetea al aplicar filtros (applyFilters)
  };

  // ✅ Filtro local SOLO por tipo de revisión (manual/automática)
  const currentPageData = useMemo(() => {
    let data = [...(justifications || [])];

    if (filters.revisionType) {
      data = data.filter((j) =>
        filters.revisionType === "manual" ? j.reviewerId : !j.reviewerId
      );
    }

    return data;
  }, [justifications, filters.revisionType]);

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

  const pageItems = buildPagination(currentPage, totalPages, 1);

  // 🔽 Exportar Excel con los *mismos filtros aplicados en la tabla*
  const onExportExcel = async () => {
    const start = appliedFilters.createdAtStart || "";
    const end = appliedFilters.createdAtEnd || "";
    const titulo = `justificaciones_${start.replaceAll("-", "")}_${end.replaceAll(
      "-",
      ""
    )}`.toLowerCase();

    try {
      await exportJustificationsExcelService(
        {
          type: appliedFilters.type || undefined,
          status: appliedFilters.status || undefined,
          createdAtStart: appliedFilters.createdAtStart || undefined,
          createdAtEnd: appliedFilters.createdAtEnd || undefined,
          search: appliedFilters.search || undefined,
          revisionType: appliedFilters.revisionType || undefined,
        },
        titulo || "justificaciones"
      );
    } catch (e) {
      alert(e?.message || "No se pudo exportar el Excel");
    }
  };

  const shownCount = currentPageData.length;
  const totalCount = totalItems ?? shownCount;

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-10">
          <div className="card shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Justificaciones (Administrador)</h5>
              {/* Botón Exportar en el header */}
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={onExportExcel}
                title="Exportar Excel con los filtros actuales"
              >
                Exportar Excel
              </button>
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
                    onChange={(e) => handleInputChange("search", e.target.value)}
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

              {/* 🔹 Resumen + Selector por página */}
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <small className="text-muted">
                  Mostrando <strong>{shownCount}</strong> de{" "}
                  <strong>{totalCount}</strong> registros
                  {totalPages > 1 && (
                    <>
                      {" "}
                      (página {currentPage} de {totalPages})
                    </>
                  )}
                </small>

                <div className="d-inline-flex align-items-center gap-2 bg-light border rounded-pill px-3 py-1 shadow-sm">
                  <span className="text-muted small fw-semibold">Por página:</span>
                  <select
                    className="form-select form-select-sm border-0 bg-transparent fw-semibold"
                    style={{ width: "70px", boxShadow: "none" }}
                    value={pageSize}
                    onChange={(e) => {
                      const newSize = Number(e.target.value) || 10;
                      setPageSize(newSize); // 🔁 backend se vuelve a llamar con nuevo pageSize
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

              {/* 🔹 Paginador (de servidor) */}
              {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-center align-items-center flex-wrap gap-2">
                  <button
                    className="btn btn-outline-secondary btn-sm rounded-pill"
                    onClick={() => setPage(1)}
                    disabled={currentPage === 1}
                    title="Primera página"
                  >
                    ⏮
                  </button>

                  {pageItems.map((item, idx) =>
                    typeof item === "number" ? (
                      <button
                        key={`p-${item}`}
                        className={`btn btn-sm rounded-pill ${
                          item === currentPage
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
                    disabled={currentPage === totalPages}
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
