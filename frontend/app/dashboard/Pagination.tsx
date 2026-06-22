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

  /* Índices */
  indiceInicio: number;
  indiceFin: number;

  /* Estado */
  paginaActual: number;
  totalPaginas: number;

  /* Página actual */
  setPaginaActual: React.Dispatch<
    React.SetStateAction<number>
  >;

  /* Registros por página */
  registrosPorPagina: number;

  setRegistrosPorPagina: React.Dispatch<
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

  registrosPorPagina,

  setRegistrosPorPagina,

}: Props) {
  return (

    /* ===============================================
       PAGINACIÓN
    ================================================ */



















    <div className="tablePagination">

    {/* ===========================================
        INFORMACIÓN
    ============================================ */}

    <div className="paginationInfo">

        Mostrando

        <strong>

            {impresoras.length === 0
                ? 0
                : indiceInicio + 1}

            {" - "}

            {Math.min(indiceFin, impresoras.length)}

        </strong>

        de

        <strong>

            {impresoras.length}

        </strong>

        registros

    </div>

    {/* ===========================================
        CONTROLES
    ============================================ */}

    <div className="paginationControls">

        <button
            className="pageBtn"
            disabled={paginaActual === 1}
            onClick={() =>
                setPaginaActual((p) => p - 1)
            }
        >

            Anterior

        </button>

        {Array.from(
            { length: totalPaginas },
            (_, i) => i + 1
        ).map((pagina) => (

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

        <button
            className="pageBtn"
            disabled={paginaActual === totalPaginas}
            onClick={() =>
                setPaginaActual((p) => p + 1)
            }
        >

            Siguiente

        </button>

    </div>

    {/* ===========================================
        REGISTROS POR PÁGINA
    ============================================ */}

    <div className="rowsPerPage">

        <span>

            Registros por página

        </span>

        <select
            value={registrosPorPagina}
            onChange={(e) => {

                setPaginaActual(1);

                setRegistrosPorPagina(
                    Number(e.target.value)
                );

            }}
        >

            <option value={15}>15</option>

            <option value={25}>25</option>

            <option value={50}>50</option>

            <option value={100}>100</option>

        </select>

    </div>

</div>
  );
}