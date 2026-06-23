"use client";

/* ==================================================
   IMPORTACIONES
================================================== */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPenToSquare,
  faTrash,
  faXmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import type { UsuarioAdmin } from "./types";

/* ==================================================
   PROPIEDADES DEL COMPONENTE
================================================== */

interface Props {
  rol: string;

  mostrar: boolean;

  administradoresRegistrados: UsuarioAdmin[];

  setMostrar: (value: boolean) => void;

  abrirEditarAdmin: (
    admin: UsuarioAdmin
  ) => void;

  eliminarAdmin: (
    id?: string
  ) => void;

  abrirNuevoAdmin: () => void;
}

/* ==================================================
   COMPONENTE
================================================== */

export default function AdminListModal({

  rol,

  mostrar,

  administradoresRegistrados,

  setMostrar,

  abrirEditarAdmin,

  eliminarAdmin,

  abrirNuevoAdmin,

}: Props) {

  /* ===============================================
     SI NO ES ADMIN O EL MODAL ESTÁ CERRADO
     NO SE RENDERIZA NADA
  ================================================ */

  if (rol !== "admin" || !mostrar) {
    return null;
  }

  return (

    /* ===============================================
       OVERLAY
    ================================================ */

    <div className="overlayStyle">

      <div className="adminListModal">

        {/* ===========================================
            ENCABEZADO DEL MODAL
        ============================================ */}

        <div className="modalHeader">

          <div>

            <h2 className="modalTitle">
              Administradores
            </h2>

            <p className="modalDescription">
              Administradores registrados.
            </p>

          </div>

          {/* Botón para cerrar */}

          <button
            className="adminCloseBtn"
            onClick={() => setMostrar(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

        </div>

        <div className="modalDivider"></div>

        {/* ===========================================
            CONTENIDO
        ============================================ */}

        <div className="adminListBody">

          {/* Total de administradores */}

          <p className="adminListTotal">
            Total: {administradoresRegistrados.length}
          </p>

          {/* =======================================
              TABLA
          ======================================== */}

          <div className="adminTableBox">

            <table className="adminDataTable">

              <thead>

                <tr>

                  <th className="adminHeadCell">
                    Usuario
                  </th>

                  <th className="adminHeadCell">
                    Rol
                  </th>

                  <th className="adminHeadCell">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {administradoresRegistrados.map((admin) => (

                  <tr key={admin._id}>

                    {/* Usuario */}

                    <td className="adminCell">
                      {admin.usuario}
                    </td>

                    {/* Rol */}

                    <td className="adminCell">
                      {admin.rol}
                    </td>

                    {/* Botones */}

                    <td className="adminCell">

                      <div className="adminActionBtns">

                        {/* Editar */}

                        <button
                          className="iconBtn editBtn"
                          onClick={() =>
                            abrirEditarAdmin(admin)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                          />
                        </button>

                        {/* Eliminar */}

                        <button
                          className="iconBtn deleteBtn"
                          onClick={() =>
                            eliminarAdmin(admin._id)
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                          />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* =======================================
              BOTÓN NUEVO REGISTRO
          ======================================== */}

          <button
    type="button"
    className="newAdminBtn"
    onClick={abrirNuevoAdmin}
>
    <FontAwesomeIcon icon={faPlus} />
    Nuevo registro
</button>

        </div>

      </div>

    </div>

  );
}