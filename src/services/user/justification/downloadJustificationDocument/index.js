import apiClient from "src/services/apiClient";

/** filename desde Content-Disposition (soporta filename* y filename) */
function getFilenameFromContentDisposition(header) {
  if (!header) return null;
  try {
    const parts = header.split(";").map((p) => p.trim());
    const fnStar = parts.find((p) => /^filename\*\s*=/.test(p.toLowerCase()));
    if (fnStar) {
      let v = fnStar.split("=")[1];
      if (v) {
        v = v.trim().replace(/^["']|["']$/g, "");
        const idx = v.indexOf("''");
        if (idx > -1) v = v.slice(idx + 2);
        try { return decodeURIComponent(v); } catch { return v; }
      }
    }
    const fn = parts.find((p) => /^filename\s*=/.test(p.toLowerCase()));
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

/** Detección de MIME por firma binaria (PDF/PNG/JPEG) */
function detectMimeFromBuffer(ab) {
  if (!ab) return null;
  const b = new Uint8Array(ab);
  if (b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d) return "application/pdf";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return "image/png";
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  return null;
}

function extFromMime(mime = "") {
  const m = (mime || "").toLowerCase();
  if (m.includes("pdf")) return "pdf";
  if (m.includes("png")) return "png";
  if (m.includes("jpeg") || m.includes("jpg")) return "jpg";
  return "bin";
}
function mimeFromExt(ext = "") {
  const e = ext.replace(/^\./, "").toLowerCase();
  if (e === "pdf") return "application/pdf";
  if (e === "png") return "image/png";
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}
function ensureExtension(filename, mime) {
  const hasDot = /\.[a-z0-9]{2,5}$/i.test(filename || "");
  return hasDot ? filename : `${filename}.${extFromMime(mime)}`;
}

/**
 * Descarga el adjunto (funciona tanto con response RAW como con solo data).
 * Pasa un fallback “bonito” desde la UI: ej.
 *   const titulo = `justificacion_${rut}_${nombre}_${fecha}_${tipo}`.toLowerCase();
 *   downloadJustificationDocument(id, titulo, { hintMime: documentMime })
 */
const downloadJustificationDocument = async (id, fallbackBaseName = "documento", opts = {}) => {
  const resp = await apiClient({
    method: "GET",
    url: `/justification/${encodeURIComponent(id)}/document`,
    responseType: "arraybuffer",
    validateStatus: (s) => s >= 200 && s < 500,
  });

  // Compatibilidad: resp puede ser el response completo (raw) o solo el ArrayBuffer
  const isRaw = resp && typeof resp === "object" && "data" in resp && resp.data instanceof ArrayBuffer;
  const data    = isRaw ? resp.data    : resp;          // ArrayBuffer
  const headers = isRaw ? (resp.headers || {}) : {};    // si no hay raw, queda {}
  const status  = isRaw ? (resp.status ?? 200) : 200;   // si no hay raw, asumimos 200

  if (status >= 400) {
    try {
      const txt = new TextDecoder().decode(data);
      throw new Error(txt || `Error HTTP ${status}`);
    } catch {
      throw new Error(`Error HTTP ${status}`);
    }
  }

  // Defensa extra: si es texto (HTML/JSON), aborta
  const first = new Uint8Array(data)[0];
  const looksLikeText = first === 0x3C /* '<' */ || first === 0x7B /* '{' */;
  if (looksLikeText) {
    const preview = new TextDecoder().decode(data.slice(0, 200));
    throw new Error(`La respuesta no es binaria (posible HTML/JSON): ${preview}`);
  }

  // MIME por header/firma/hints
  let mime = headers["content-type"] || "";
  const detected = detectMimeFromBuffer(data);
  if (detected) mime = detected;
  if (!mime || mime === "application/octet-stream") {
    if (opts.hintMime) mime = opts.hintMime;
    else if (opts.hintExt) mime = mimeFromExt(opts.hintExt);
    else mime = "application/octet-stream";
  }

  // Nombre: intenta Content-Disposition si hay headers, si no usa fallback
  let filename = null;
  const cd = headers["content-disposition"];
  if (cd) filename = getFilenameFromContentDisposition(cd);

  if (!filename || filename === "undefined" || filename === "null") {
    const safeFallback = (fallbackBaseName && String(fallbackBaseName).trim()) ? fallbackBaseName : "documento";

    // Bonus: si estás usando axiosInstance raw, intenta desde responseURL
    let fromUrl = "";
    try {
      const u = isRaw ? (resp.request?.responseURL || "") : "";
      const last = (u.split("/").pop() || "");
      fromUrl = /\.[a-z0-9]{2,5}$/i.test(last) ? last : "";
    } catch {}

    filename = fromUrl || safeFallback;
  }

  filename = ensureExtension(filename, mime);

  const blob = new Blob([data], { type: mime });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
};

export default downloadJustificationDocument;
