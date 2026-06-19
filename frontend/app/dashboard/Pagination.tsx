"use client";

/* ==================================================
   IMPORTACIONES
================================================== */

import type { Impresora } from "./types";

/* ==================================================
   PROPIEDADES DEL COMPONENTE
================================================== */

interface Props {
  /* Registros mostrados en la tabla */
  impresoras: Impresora[];

  /* Índices de la paginación */
  indiceInicio: number;
  indiceFin: number;

  /* Estado de la paginación */
  paginaActual: number;
  totalPaginas: number;

  /* Cambiar la página actual */
  setPaginaActual: React.Dispatch<
    React.SetStateAction<number>
  >;
}

/* ==================================================
   COMPONENTE
================================================== */

export default function Pagination({
  impresoras,
  indiceInicio,
  indiceFin,
  paginaActual,
  totalPaginas,
  setPaginaActual,
}: Props) {
  return (

    /* ===============================================
       PAGINACIÓN
    ================================================ */

    <div className="tablePagination">

      {/* ===========================================
          INFORMACIÓN DE REGISTROS
      ============================================ */}

      <div className="paginationInfo">

        Mostrando{" "}

        {impresoras.length === 0
          ? 0
          : indiceInicio + 1}

        {" - "}

        {Math.min(
          indiceFin,
          impresoras.length
        )}

        {" de "}

        {impresoras.length}

        {" registros"}

      </div>

      {/* ===========================================
          CONTROLES DE PAGINACIÓN
      ============================================ */}

      <div className="paginationControls">

        {/* Página anterior */}

        <button
          className="pageBtn"
          disabled={paginaActual === 1}
          onClick={() =>
            setPaginaActual((prev) => prev - 1)
          }
        >
          &lt;
        </button>

        {/* Números de página */}

        {Array.from(
          { length: totalPaginas },
          (_, i) => i + 1
        )
          .filter(
            (pagina) =>
              pagina === 1 ||
              pagina === totalPaginas ||
              (pagina >= paginaActual - 2 &&
                pagina <= paginaActual + 2)
          )
          .map((pagina) => (

            <button
              key={pagina}
              className={`pageBtn ${
                paginaActual === pagina
                  ? "activePageBtn"
                  : ""
              }`}
              onClick={() =>
                setPaginaActual(pagina)
              }
            >
              {pagina}
            </button>

          ))}

        {/* Página siguiente */}

        <button
          className="pageBtn"
          disabled={
            paginaActual === totalPaginas
          }
          onClick={() =>
            setPaginaActual((prev) => prev + 1)
          }
        >
          &gt;
        </button>

      </div>

    </div>
  );
}