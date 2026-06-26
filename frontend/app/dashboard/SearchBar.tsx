// COMPONENTE SEARCHBAR (FILTROS Y ACCIONES)
 
"use client";


// IMPORTACIONES

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faList,
    faPlus,
    faSearch,
    faBuilding,
    faChevronDown,
    faDesktop,
    faComputer,
    faUsers,
    faNetworkWired,
    faFileExcel,
    faFilePdf,
} from "@fortawesome/free-solid-svg-icons";


// PROPIEDADES DEL COMPONENTE

interface SearchBarProps {
    /* Estado del usuario */
    logueado: boolean;
    token: string;

    /* Buscador */
    busqueda: string;
    setBusqueda: React.Dispatch<React.SetStateAction<string>>;

    /* Filtro por edificio */
    filtroEdificio: string;
    setFiltroEdificio: React.Dispatch<React.SetStateAction<string>>;

    /* Lista de edificios */
    edificios: string[];
    departamentos: string[];
    ubicaciones: string[];
    equipos: string[];
    
    filtroDepartamento: string;
    setFiltroDepartamento: React.Dispatch<React.SetStateAction<string>>;

    filtroUbicacion: string;
    setFiltroUbicacion: React.Dispatch<React.SetStateAction<string>>;

    filtroEquipo: string;
    setFiltroEquipo: React.Dispatch<React.SetStateAction<string>>;

    stats: {
        totalEquipos: number;
        equiposActivos: number;
        totalUsuarios: number;
        totalIPs: number;
};


// FUNCIONES

    abrirNuevo: () => void;
    exportarExcel: () => void;
    exportarPDF: () => void;

}   


// COMPONENTE

export default function SearchBar({
    logueado,
    token,
    busqueda,
    setBusqueda,
    filtroEdificio,
    setFiltroEdificio,
    edificios,
    stats,
    abrirNuevo,
    exportarExcel,
    exportarPDF,
    departamentos,
    ubicaciones,
    equipos,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroUbicacion,
    setFiltroUbicacion,
    filtroEquipo,
    setFiltroEquipo,
}: SearchBarProps) {
    return (


// ENCABEZADO DEL PANEL
   
<div className="panelHeader">

{/* TÍTULO */}

<div className="headerTopRow">
    <div className="titleArea">
        <div className="panelTitle">
            Control Equipos de Cómputo
        </div>

        <p className="panelSubtitle">
            Sistema de Gestión de Activos Informáticos
        </p>

    </div>

    <div className="statsArea">
    <div className="statCard">
    <div className="statIcon">
    <FontAwesomeIcon icon={faDesktop} />
</div>


<div>
  <span className="statLabel">
    Total de equipos
  </span>

  <h3 className="statNumber">
    {stats.totalEquipos.toLocaleString()}
  </h3>

  <small className="statSmall">
    Registros
  </small>
</div>
</div>

<div className="statCard">
   <div className="statIcon users">
    <FontAwesomeIcon icon={faUsers} />
</div>

<div>
    <span className="statLabel">
        Usuarios
    </span>

    <h3 className="statNumber">
        {stats.totalUsuarios.toLocaleString()}
    </h3>

    <small className="statSmall">
        Registrados
    </small>
</div>
</div>

<div className="statCard">
    <div className="statIcon ip">
    <FontAwesomeIcon icon={faNetworkWired} />
</div>

<div>
    <span className="statLabel">
        IPs registradas
    </span>

    <h3 className="statNumber">
        {stats.totalIPs.toLocaleString()}
    </h3>

    <small className="statSmall">
        Asignadas
    </small>
</div>
</div>
</div>
</div>


{/* BARRA DE ACCIONES */}

<div className="filtersCard">

    {/* FILA DE FILTROS */}
    <div className="filtersRow">

    {/* BUSCADOR */}
    <div className="searchBox">
        <FontAwesomeIcon
            icon={faSearch}
            className="searchIcon"
        />

        <input
            type="text"
            className="searchInput"
            placeholder="Buscar por nombre, usuario, IP..."
            value={busqueda}
            onChange={(e) =>
                setBusqueda(e.target.value)
           }
        />
    </div>

<div className="filtersRight">



{/* DEPARTAMENTO */}

<div className="filterItem">
    <select
        className="filterSelect"
        value={filtroDepartamento}
        onChange={(e) => setFiltroDepartamento(e.target.value)}
    >
    <option value="">
        Departamento
    </option>

    {departamentos.map((item) => (
      <option
        key={item}
        value={item}
      >
        {item}
      </option>
    ))}
  </select>
</div>


{/* EDIFICIO */}

<div className="filterItem">
    <select
        className="filterSelect"
        value={filtroEdificio}
        onChange={(e)=>setFiltroEdificio(e.target.value)}
    >
    <option value="">
        Edificio
    </option>

    {edificios.map((edificio)=>(
        <option
            key={edificio}
            value={edificio}
        >
            {edificio}
        </option>
    ))}

   </select>
</div>


{/* UBICACIÓN */}

<div className="filterItem">
    <select
        className="filterSelect"
        value={filtroUbicacion}
        onChange={(e)=>setFiltroUbicacion(e.target.value)}
    >
    <option value="">
        Ubicación
    </option>

    {ubicaciones.map((item)=>(
        <option
            key={item}
            value={item}
        >
            {item}
        </option>
    ))}
   </select>
</div>


{/* EQUIPO */}

<div className="filterItem">
    <select
        className="filterSelect"
        value={filtroEquipo}
        onChange={(e)=>setFiltroEquipo(e.target.value)}
    >
        <option value="">
            Equipo
        </option>

        {equipos.map((item)=>(
            <option
                key={item}
                value={item}
            >
                {item}
            </option>
        ))}
    </select>
</div>


{/* VER TODOS */}

<button
    className="btnTodos"
    onClick={() => {
        setBusqueda("");
        setFiltroDepartamento("");
        setFiltroEdificio("");
        setFiltroUbicacion("");
        setFiltroEquipo("");
    }}
>
    <FontAwesomeIcon icon={faList} />
</button>


{/* LIMPIAR */}

<button
    className="btnClearMini"
    onClick={() => {
        setBusqueda("");
        setFiltroDepartamento("");
        setFiltroEdificio("");
        setFiltroUbicacion("");
        setFiltroEquipo("");
    }}
>
    Limpiar Filtros
</button>
</div>
</div>

    
{/* BOTONES */}

<div className="actionsRow">
    {logueado && (
       <div className="leftButtons">
             <button
                 className="btnExcel"
                 onClick={exportarExcel}
              >
            <FontAwesomeIcon icon={faFileExcel}/>
            Exportar Excel
        </button>

        <button
            className="btnPDF"
            onClick={exportarPDF}
        >
            <FontAwesomeIcon icon={faFilePdf}/>
            Exportar PDF
        </button>
    </div>
)}

<div className="rightButtons">
    {logueado && (
        <button
            className="dashboardNewBtn"
            onClick={abrirNuevo}
        >
            <FontAwesomeIcon icon={faPlus}/>
                Nuevo registro
        </button>
    )}
</div>
</div>
</div>
</div>
);
}