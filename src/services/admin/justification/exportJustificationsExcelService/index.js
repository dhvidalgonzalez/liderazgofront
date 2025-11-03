// src/services/admin/justification/exportJustificationsExcelService.js
const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "/api";

function getFilenameFromContentDisposition(header) {
  if (!header) return null;
  try {
    const parts = header.split(";").map((p) => p.trim());
    const fnStar = parts.find((p) => /^filename\*\s*=/i.test(p));
    if (fnStar) {
      let v = fnStar.split("=")[1];
      if (v) {
        v = v.trim().replace(/^["']|["']$/g, "");
        const idx = v.indexOf("''");
        if (idx > -1) v = v.slice(idx + 2);
        try { return decodeURIComponent(v); } catch { return v; }
      }
    }
    const fn = parts.find((p) => /^filename\s*=/i.test(p));
    if (fn) {
      let name = fn.split("=")[1];
      if (!name) return null;
      name = name.trim();
      if ((name.startsWith('"') && name.endsWith('"')) || (name.startsWith("'") && name.endsWith("'"))) {
        name = name.slice(1, -1);
      }
      return name;
    }
    return null;
  } catch {
    return null;
  }
}
function ensureXlsx(filename) {
  if (!filename) return "justificaciones.xlsx";
  return /\.[a-z0-9]{2,5}$/i.test(filename) ? filename : `${filename}.xlsx`;
}

// ✅ AHORA USA GET CON QUERIES
export default async function exportJustificationsExcelService(filters = {}, fallbackBaseName = "justificaciones") {
  const base = String(BASE).replace(/\/$/, "");
  const params = new URLSearchParams();

  // Solo adjunta lo que tenga valor
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.createdAtStart) params.set("createdAtStart", filters.createdAtStart);
  if (filters.createdAtEnd) params.set("createdAtEnd", filters.createdAtEnd);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

  const url = `${base}/admin/justification/export?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Error HTTP ${res.status}`);
  }

  const blob = await res.blob();
  const cd = res.headers.get("Content-Disposition");
  let filename = getFilenameFromContentDisposition(cd) || fallbackBaseName;
  filename = ensureXlsx(filename);

  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}
