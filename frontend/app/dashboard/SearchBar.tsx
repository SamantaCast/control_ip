"use client";

/* ==================================================
   IMPORTACIONES
================================================== */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faList,
  faPlus,
  faSearch,
  faBuilding,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

/* ==================================================
   PROPIEDADES DEL COMPONENTE
================================================== */

interface SearchBarProps {
  /* Estado del usuario */
  logueado: boolean;
  token: string;

  /* Buscador */
  busqueda: string;
  setBusqueda: React.Dispatch<
    React.SetStateAction<string>
  >;

  /* Filtro por edificio */
  filtroEdificio: string;
  setFiltroEdificio: React.Dispatch<
    React.SetStateAction<string>
  >;
/* Lista de edificios */

edificios: string[];
  /* Funciones */
  buscar: () => void;

  cargarImpresoras: (
    token: string,
    textoBusqueda: string
  ) => void;

  abrirNuevo: () => void;
}

/* ==================================================
   COMPONENTE
================================================== */

export default function SearchBar({
  logueado,
  token,
  busqueda,
  setBusqueda,
  filtroEdificio,
  setFiltroEdificio,
  edificios,
  buscar,
  cargarImpresoras,
  abrirNuevo,
}: SearchBarProps) {

  return (

    /* ===============================================
       ENCABEZADO DEL PANEL
    ================================================ */

    <div className="panelHeader">

      {/* ===========================================
          TÍTULO
      ============================================ */}

      <div className="headerTopRow">

        <div className="panelTitle">
          Control Equipos de Cómputo
        </div>

      </div>

      {/* ===========================================
          BARRA DE ACCIONES
      ============================================ */}

      <div className="topActions">

        {/* =======================================
            BUSCADOR Y FILTROS
        ======================================== */}

        <div className="leftActions">

          <div className="panelSearch">

    {/* Buscar */}

    <div className="searchBox">

        <FontAwesomeIcon
            icon={faSearch}
            className="searchIcon"
        />

        <input
            type="text"
            className="searchInput"
            placeholder=" "
            value={busqueda}
            onChange={(e)=>
                setBusqueda(e.target.value)
            }
        />

    </div>

    {/* Edificio */}

    <div className="searchBox">

        <FontAwesomeIcon
            icon={faBuilding}
            className="searchIcon"
        />

        <select
            className="searchSelect"
            value={filtroEdificio}
            onChange={(e)=>
                setFiltroEdificio(e.target.value)
            }
        >

            <option value="">Todos</option>

            {edificios.map((edificio) => (

                <option
                    key={edificio}
                    value={edificio}
                >
                    {edificio}
                </option>

            ))}

        </select>

        <FontAwesomeIcon
            icon={faChevronDown}
            className="selectArrow"
        />

    </div>

    {/* Ver todos */}

    <button
        type="button"
        className="btnTodos"
        onClick={()=>{
            setBusqueda("");
            setFiltroEdificio("");
        }}
    >

        <FontAwesomeIcon icon={faList}/>

        Ver todos

    </button>

</div>
        </div>

        {/* =======================================
            BOTÓN NUEVO REGISTRO
        ======================================== */}

        <div className="rightActions">

          {logueado && (

            <button
  type="button"
  className="dashboardNewBtn"
  onClick={abrirNuevo}
>
  <FontAwesomeIcon icon={faPlus} />
  Nuevo registro
</button>

          )}

        </div>

      </div>

    </div>

  );
}