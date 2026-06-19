"use client";

/* ==================================================
   IMPORTACIONES
================================================== */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import type { Impresora } from "./types";

/* ==================================================
   PROPIEDADES DEL COMPONENTE
================================================== */

interface Props {
  impresoras: Impresora[];

  impresorasPaginadas: Impresora[];

  logueado: boolean;

  abrirEditar: (imp: Impresora) => void;

  eliminar: (id?: string) => void;
}

/* ==================================================
   COMPONENTE
================================================== */

export default function EquipmentTable({
  impresoras,
  impresorasPaginadas,
  logueado,
  abrirEditar,
  eliminar,
}: Props) {
  return (

    /* ===============================================
       TABLA DE REGISTROS
    ================================================ */

    <div className="tableBox">

      <table className="dataTable">

        {/* ===========================================
            ENCABEZADO DE LA TABLA
        ============================================ */}

        <thead>

          <tr>

            <th className="tableHeadCell">
              Departamento
            </th>

            <th className="tableHeadCell">
              Edificio
            </th>

            <th className="tableHeadCell">
              Ubicación
            </th>

            <th className="tableHeadCell">
              Nombre
            </th>

            <th className="tableHeadCell">
              Email
            </th>

            <th className="tableHeadCell">
              Equipo
            </th>

            <th className="tableHeadCell">
              Usuario
            </th>

            <th className="tableHeadCell">
              IP
            </th>

            <th className="tableHeadCell">
              Código
            </th>

            {logueado && (
              <th className="tableHeadCell">
                Acciones
              </th>
            )}

          </tr>

        </thead>

        {/* ===========================================
            CUERPO DE LA TABLA
        ============================================ */}

        <tbody>

          {/* Sin registros */}

          {impresoras.length === 0 ? (

            <tr>

              <td
                colSpan={logueado ? 10 : 9}
                className="emptyState"
              >
                No se encontraron registros
              </td>

            </tr>

          ) : (

            /* Registros */

            impresorasPaginadas.map((imp) => (

              <tr key={imp._id}>

                <td className="tableCell">
                  {imp.departamento}
                </td>

                <td className="tableCell">
                  {imp.edificio}
                </td>

                <td className="tableCell">
                  {imp.ubicacion}
                </td>

                <td className="tableCell">
                  {imp.nombre}
                </td>

                <td className="tableCell">
                  {imp.email}
                </td>

                <td className="tableCell">
                  {imp.equipo}
                </td>

                <td className="tableCell">
                  {imp.usuario}
                </td>

                <td className="tableCell">
                  {imp.ip}
                </td>

                <td className="tableCell">
                  {imp.codigo}
                </td>

                {/* Botones de acción */}

                {logueado && (

                  <td className="tableCell">

                    <div className="actionBtns">

                      {/* Editar */}

                      <button
                        className="iconBtn editBtn"
                        onClick={() => abrirEditar(imp)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                        />
                      </button>

                      {/* Eliminar */}

                      <button
                        className="iconBtn deleteBtn"
                        onClick={() => eliminar(imp._id)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                        />
                      </button>

                    </div>

                  </td>

                )}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}