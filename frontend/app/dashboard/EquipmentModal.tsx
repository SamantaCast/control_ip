"use client";

/* ==========================================================
   IMPORTACIONES
========================================================== */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faClipboardList,
  faBuilding,
  faLocationDot,
  faUser,
  faEnvelope,
  faDesktop,
  faNetworkWired,
  faBarcode,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import type { Impresora } from "./types";

/* ==========================================================
   PROPIEDADES DEL COMPONENTE
========================================================== */

interface Props {
  mostrarFormulario: boolean;
  editandoId: string | null;

  form: Impresora;

  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  guardar: () => void;

  setMostrarFormulario: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setEditandoId: React.Dispatch<
    React.SetStateAction<string | null>
  >;
}

/* ==========================================================
   COMPONENTE
========================================================== */

export default function EquipmentModal({

  mostrarFormulario,

  editandoId,

  form,

  handleChange,

  guardar,

  setMostrarFormulario,

  setEditandoId,

}: Props) {

  if (!mostrarFormulario) return null;

  return (

    <div className="overlayStyle">

      {/* ==================================================
          MODAL
      ================================================== */}

      <div className="modalStyle">

        {/* ==================================================
            BOTÓN CERRAR
        ================================================== */}

        <button
          type="button"
          className="closeModalBtn"
          onClick={() => {
            setMostrarFormulario(false);
            setEditandoId(null);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* ==================================================
            ENCABEZADO
        ================================================== */}

        <div className="modalHeader">

          <div className="modalHeaderIcon">

            <FontAwesomeIcon
              icon={faClipboardList}
            />

          </div>

          <div>

            <h2 className="modalTitle">

              {editandoId
                ? "Editar registro"
                : "Agregar registro"}

            </h2>

            <p className="modalDescription">

              Complete la información correspondiente
              al equipo de cómputo.

            </p>

          </div>

        </div>

        <div className="modalDivider"></div>

        {/* ==================================================
            DATOS GENERALES
        ================================================== */}

        <div className="formSection">

          <div className="sectionHeader">

            <div className="sectionIcon">

              <FontAwesomeIcon
                icon={faClipboardList}
              />

            </div>

            <h3 className="sectionTitle">

              Datos Generales

            </h3>

          </div>

          <div className="formGrid">

            {/* Departamento */}

            <div className="inputWrapper">

              <div className="inputIcon">

                <FontAwesomeIcon
                  icon={faBuilding}
                />

              </div>

              <input
                className="formInput"
                name="departamento"
                placeholder="Departamento"
                value={form.departamento}
                onChange={handleChange}
              />

            </div>

            {/* Edificio */}

            <div className="inputWrapper">

              <div className="inputIcon">

                <FontAwesomeIcon
                  icon={faBuilding}
                />

              </div>

              <input
                className="formInput"
                name="edificio"
                placeholder="Edificio"
                value={form.edificio}
                onChange={handleChange}
              />

            </div>

            {/* Ubicación */}

            <div className="inputWrapper">

              <div className="inputIcon">

                <FontAwesomeIcon
                  icon={faLocationDot}
                />

              </div>

              <input
                className="formInput"
                name="ubicacion"
                placeholder="Ubicación"
                value={form.ubicacion}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* ==================================================
            RESPONSABLE
        ================================================== */}

        <div className="formSection">

          <div className="sectionHeader">

            <div className="sectionIcon">

              <FontAwesomeIcon
                icon={faUser}
              />

            </div>

            <h3 className="sectionTitle">

              Responsable

            </h3>

          </div>

          <div className="formGrid">
                        {/* ==================================================
                RESPONSABLE
            ================================================== */}

            {/* Nombre */}

            <div className="inputWrapper">

              <div className="inputIcon">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <input
                className="formInput"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
              />

            </div>

            {/* Correo electrónico */}

            <div className="inputWrapper">

              <div className="inputIcon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <input
                className="formInput"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
              />

            </div>

            {/* Usuario */}

            <div className="inputWrapper">

              <div className="inputIcon">
                <FontAwesomeIcon icon={faUser} />
              </div>

              <input
                className="formInput"
                name="usuario"
                placeholder="Usuario"
                value={form.usuario}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* ==================================================
            EQUIPO
        ================================================== */}

        <div className="formSection">

          <div className="sectionHeader">

            <div className="sectionIcon">

              <FontAwesomeIcon
                icon={faDesktop}
              />

            </div>

            <h3 className="sectionTitle">

              Equipo

            </h3>

          </div>

          <div className="formGrid">

            {/* Equipo */}

            <div className="inputWrapper">

              <div className="inputIcon">
                <FontAwesomeIcon icon={faDesktop} />
              </div>

              <input
                className="formInput"
                name="equipo"
                placeholder="Equipo"
                value={form.equipo}
                onChange={handleChange}
              />

            </div>

            {/* Dirección IP */}

            <div className="inputWrapper">

              <div className="inputIcon">
                <FontAwesomeIcon
                  icon={faNetworkWired}
                />
              </div>

              <input
                className="formInput"
                name="ip"
                placeholder="Dirección IP"
                value={form.ip}
                onChange={handleChange}
              />

            </div>

            {/* Código */}

            <div className="inputWrapper">

              <div className="inputIcon">
                <FontAwesomeIcon icon={faBarcode} />
              </div>

              <input
                className="formInput"
                name="codigo"
                placeholder="Código"
                value={form.codigo}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* ==================================================
            BOTONES DEL MODAL
        ================================================== */}

        <div className="modalFooter">

          <button
            type="button"
            className="cancelBtn"
            onClick={() => {
              setMostrarFormulario(false);
              setEditandoId(null);
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="saveBtn"
            onClick={guardar}
          >
            {editandoId
              ? "Actualizar"
              : "Guardar"}
          </button>

        </div>

      </div>

    </div>

  );

}