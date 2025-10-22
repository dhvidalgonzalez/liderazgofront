import React, { useState, useMemo } from "react";
import Update from "../update";
import { useDataContext } from "../context";

/**
 * 💼 Tabla principal de perfiles de empleados
 * - Soporta paginación server-side (vía DataContext) o client-side (fallback).
 * - Paginación con primera, última y bloque central con "..." cuando crece.
 */
const View = ({ employeeProfiles }) => {
  const {
    // Estos existen si usas el DataContext actualizado con paginación server-side
    pagination,
    page: ctxPage,
    setPage: ctxSetPage,
    setQueryParams,
    pageSize: ctxPageSize,
  } = useDataContext() || {};

  const usingServer = !!pagination; // ¿Viene paginado del backend?
  const [search, setSearch] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Estado local solo para fallback client-side
  const [page, setPage] = useState(1);
  const localPageSize = 10;

  const effectivePage = usingServer ? (ctxPage || 1) : page;
  const effectiveSetPage = usingServer
    ? (p) => ctxSetPage && ctxSetPage(p)
    : (p) => setPage(p);

  const pageSize = usingServer ? (ctxPageSize || localPageSize) : localPageSize;

  // 🔍 Búsqueda:
  // - Server-side: delega al backend con setQueryParams({ q, page:1 })
  // - Client-side: filtra el array localmente
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (usingServer && setQueryParams) {
      setQueryParams({ q: value, page: 1 });
    } else {
      effectiveSetPage(1);
    }
  };

  const filteredProfiles = useMemo(() => {
    if (usingServer) return employeeProfiles; // ya vino filtrado/paginado del server
    const query = search.toLowerCase();
    return employeeProfiles.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const rut = (p.rut || "").toLowerCase();
      const gerencia = (p.gerencia || "").toLowerCase();
      return (
        name.includes(query) ||
        rut.includes(query) ||
        gerencia.includes(query)
      );
    });
  }, [employeeProfiles, search, usingServer]);

  const totalPages = usingServer
    ? (pagination?.totalPages || 1)
    : Math.max(1, Math.ceil(filteredProfiles.length / pageSize));

  const currentPageData = usingServer
    ? employeeProfiles // ya viene del backend solo la página actual
    : filteredProfiles.slice((effectivePage - 1) * pageSize, effectivePage * pageSize);

  // 🧮 Genera páginas con elipsis: [1, '...', 4,5,6, '...', N]
  const buildPagination = (current, total, siblingCount = 1) => {
    if (total <= 7) {
      // Pequeño: muestro todo
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const first = 1;
    const last = total;
    const start = Math.max(first + 1, current - siblingCount);
    const end = Math.min(last - 1, current + siblingCount);

    const pages = [first];

    if (start > first + 1) pages.push("start-ellipsis");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < last - 1) pages.push("end-ellipsis");

    if (last !== first) pages.push(last);

    // Evitar duplicados por cercanía a extremos
    return pages.filter((v, i, a) => a.indexOf(v) === i);
  };

  const pageItems = buildPagination(effectivePage, totalPages, 1);

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
                    onChange={handleSearchChange}
                  />
                </div>
              </div>

              {/* 📋 Tabla */}
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

              {/* 🔢 Paginador con elipsis */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center mt-3 gap-1 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => effectiveSetPage(1)}
                    disabled={effectivePage === 1}
                    title="Primera página"
                  >
                    ⏮
                  </button>

                  {pageItems.map((item, idx) =>
                    typeof item === "number" ? (
                      <button
                        key={`p-${item}`}
                        className={`btn btn-sm ${
                          item === effectivePage ? "btn-primary" : "btn-outline-primary"
                        }`}
                        onClick={() => effectiveSetPage(item)}
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
                    className="btn btn-sm btn-outline-primary ms-1"
                    onClick={() => effectiveSetPage(totalPages)}
                    disabled={effectivePage === totalPages}
                    title="Última página"
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
