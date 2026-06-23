"use client";

/* ==================================================
   IMPORTACIONES
================================================== */
import {
    faChevronLeft,
    faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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





























const obtenerPaginas = (): (number | string)[] => {

    if (totalPaginas <= 7) {

        return Array.from(
            { length: totalPaginas },
            (_, i) => i + 1
        );

    }

    // Inicio
    if (paginaActual <= 4) {

        return [1, 2, 3, 4, 5, "...", totalPaginas];

    }

    // Final
    if (paginaActual >= totalPaginas - 3) {

        return [

            1,

            "...",

            totalPaginas - 4,

            totalPaginas - 3,

            totalPaginas - 2,

            totalPaginas - 1,

            totalPaginas

        ];

    }

    // Centro

    return [

        1,

        "...",

        paginaActual - 1,

        paginaActual,

        paginaActual + 1,

        "...",

        totalPaginas

    ];

};



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
    className="pageBtn pageArrow"
    disabled={paginaActual === 1}
    onClick={() =>
        setPaginaActual((p) => p - 1)
    }
>

    <FontAwesomeIcon icon={faChevronLeft} />

</button>











{obtenerPaginas().map((item, index) => (

    typeof item === "string"

    ? (

        <span
            key={`dots-${index}`}
            className="pageDots"
        >
            ...
        </span>

    )

    : (

        <button

            key={`page-${item}-${index}`}

            className={`pageBtn ${
                paginaActual === item
                    ? "activePageBtn"
                    : ""
            }`}

            onClick={() => setPaginaActual(item)}

        >

            {item}

        </button>

    )

))}

       <button
    className="pageBtn pageArrow"
    disabled={paginaActual === totalPaginas}
    onClick={() =>
        setPaginaActual((p) => p + 1)
    }
>

    <FontAwesomeIcon icon={faChevronRight} />

</button>
    </div>

  {/* ===========================================
    REGISTROS POR PÁGINA
=========================================== */}

<div className="rowsPerPage">

    <span>

        Mostrar

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