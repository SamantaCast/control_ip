/* Componente de búsqueda, filtros y acciones. */

"use client";

// Importaciones.

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faList,
  faPlus,
  faSearch,
  faDesktop,
  faUsers,
  faNetworkWired,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

// Propiedades del componente.

interface SearchBarProps {

  // Estado del usuario.

  logueado: boolean;
  token: string;

  // Estado del buscador.

  busqueda: string;
  setBusqueda: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por edificio.

  filtroEdificio: string;
  setFiltroEdificio: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Listas de filtros.

  edificios: string[];
  departamentos: string[];
  ubicaciones: string[];
  equipos: string[];

  // Filtro por departamento.

  filtroDepartamento: string;
  setFiltroDepartamento: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por ubicación.

  filtroUbicacion: string;
  setFiltroUbicacion: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Filtro por equipo.

  filtroEquipo: string;
  setFiltroEquipo: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Estadísticas del sistema.

  stats: {
    totalEquipos: number;
    equiposActivos: number;
    totalUsuarios: number;
    totalIPs: number;
  };

  // Funciones.

  abrirNuevo: () => void;
  exportarExcel: () => void;
  exportarPDF: () => void;
}

// Componente principal.

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
    <>

      {/* Encabezado del panel. */}

      <div className="panelHeader">

        {/* Título del sistema. */}

        <div className="headerTopRow">

          <div className="titleArea">

            <div className="panelTitle">
              Control Equipos de Cómputo
            </div>

            <p className="panelSubtitle">
              Sistema de Gestión de Activos Informáticos
            </p>

          </div>

          {/* Tarjetas de estadísticas. */}

          <div className="statsArea">

            {/* Tarjeta de equipos registrados. */}

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

            {/* Tarjeta de usuarios registrados. */}

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

            {/* Tarjeta de direcciones IP registradas. */}

            <div className="statCard">

              <div className="statIcon ip">
                <FontAwesomeIcon
                  icon={faNetworkWired}
                />
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

                {/* Barra de acciones. */}

        <div className="filtersCard">

          {/* Fila de filtros. */}

          <div className="filtersRow">

            {/* Buscador. */}

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

            {/* Contenedor de filtros. */}

            <div className="filtersRight">

              {/* Filtro por departamento. */}

              <div className="filterItem">

                <select
                  className="filterSelect"
                  value={filtroDepartamento}
                  onChange={(e) =>
                    setFiltroDepartamento(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    DEPARTAMENTO
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

              {/* Filtro por edificio. */}

              <div className="filterItem">

                <select
                  className="filterSelect"
                  value={filtroEdificio}
                  onChange={(e) =>
                    setFiltroEdificio(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    EDIFICIO
                  </option>

                  {edificios.map((edificio) => (
                    <option
                      key={edificio}
                      value={edificio}
                    >
                      {edificio}
                    </option>
                  ))}

                </select>

              </div>

              {/* Filtro por ubicación. */}

              <div className="filterItem">

                <select
                  className="filterSelect"
                  value={filtroUbicacion}
                  onChange={(e) =>
                    setFiltroUbicacion(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    UBICACIÓN
                  </option>

                  {ubicaciones.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

              </div>

              {/* Filtro por equipo. */}

              <div className="filterItem">

                <select
                  className="filterSelect"
                  value={filtroEquipo}
                  onChange={(e) =>
                    setFiltroEquipo(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    EQUIPO
                  </option>

                  {equipos.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

              </div>

              {/* Botón para limpiar los filtros. */}

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
                Limpiar filtros
              </button>

            </div>

          </div>
                  {/* Botones de acciones. */}

        <div className="actionsRow">

          {/* Botones de exportación. */}

          {logueado && (
            <div className="leftButtons">

              <button
                className="btnExcel"
                onClick={exportarExcel}
              >
                <FontAwesomeIcon icon={faFileExcel} />
                Exportar Excel
              </button>

              <button
                className="btnPDF"
                onClick={exportarPDF}
              >
                <FontAwesomeIcon icon={faFilePdf} />
                Exportar PDF
              </button>

            </div>
          )}

          {/* Botón para agregar un registro. */}

          <div className="rightButtons">

            {logueado && (
              <button
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

    </div>

  </>
);
}