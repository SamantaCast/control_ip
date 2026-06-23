"use client";

/* ==================================================
   IMPORTACIONES
================================================== */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUsers,
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import type { FormAdmin } from "./types";

/* ==================================================
   PROPIEDADES DEL COMPONENTE
================================================== */

interface Props {
  rol: string;

  mostrar: boolean;

  editandoAdminId: string | null;

  formAdmin: FormAdmin;

  mostrarContrasenasAdmin: boolean;

  setMostrarContrasenasAdmin: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  cumpleLongitud: boolean;
  cumpleMayuscula: boolean;
  cumpleMinuscula: boolean;
  cumpleSimbolo: boolean;
  cumpleRepeticion: boolean;

  adminInputRefs: React.MutableRefObject<
    (HTMLInputElement | null)[]
  >;

  guardarAdmin: () => void;

  cerrarFormularioAdmin: () => void;
  cancelarFormularioAdmin: () => void;

  handleAdminChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  moverAdminConEnter: (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => void;
}

/* ==================================================
   COMPONENTE
================================================== */

export default function AdminModal({
  rol,
  mostrar,
  editandoAdminId,
  formAdmin,
  mostrarContrasenasAdmin,
  setMostrarContrasenasAdmin,
  cumpleLongitud,
  cumpleMayuscula,
  cumpleMinuscula,
  cumpleSimbolo,
  cumpleRepeticion,
  adminInputRefs,
  guardarAdmin,
  cerrarFormularioAdmin,
  cancelarFormularioAdmin,
  handleAdminChange,
  moverAdminConEnter,
}: Props) {

  /* ===============================================
     SI NO ES ADMIN O EL MODAL ESTÁ CERRADO
  ================================================ */

  if (rol !== "admin" || !mostrar) {
    return null;
  }

  return (
    <div className="overlayStyle">

      {/* ===========================================
          FORMULARIO
      ============================================ */}

      <form
        className="adminModalStyle"
        onSubmit={(e) => {
          e.preventDefault();
          guardarAdmin();
        }}
      >

        {/* =======================================
            ENCABEZADO
        ======================================== */}

        <div className="modalHeader">

          <div className="modalHeaderIcon">
            <FontAwesomeIcon icon={faUsers} />
          </div>

          <div>

            <h2 className="modalTitle">
              {editandoAdminId
                ? "Editar Administrador"
                : "Nuevo Administrador"}
            </h2>

            <p className="modalDescription">
              Capture la información del administrador.
            </p>

          </div>

        </div>

















        <div className="modalDivider"></div>

        {/* Botón para cerrar */}

        <button
          type="button"
          className="adminCloseBtn"
          onClick={cerrarFormularioAdmin}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>





























































        {/* =======================================
            CUERPO DEL FORMULARIO
        ======================================== */}

       
































        <div className="formSection">


           {/* Nombre completo */}

<div className="inputWrapper">

    <div className="inputIcon">

        <FontAwesomeIcon icon={faUser}/>

    </div>

    <input
        ref={(el) => {
            adminInputRefs.current[0] = el;
        }}

        name="nombre"

        placeholder="Nombre completo"

        value={formAdmin.nombre}

        onChange={handleAdminChange}

        onKeyDown={(e) => moverAdminConEnter(e, 0)}

        className="formInput"

        required
    />

</div>

          {/* Usuario */}

          <div className="inputWrapper">

            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
             ref={(el) => {
    adminInputRefs.current[1] = el;
}}

onKeyDown={(e) => moverAdminConEnter(e, 1)}
              name="usuario"
              placeholder="Usuario"
              value={formAdmin.usuario}
              onChange={handleAdminChange}
              className="formInput"
              autoComplete="username"
              required
            />

          </div>

          {/* Contraseña */}

          <div className="inputWrapper">

            <div className="inputIcon">
              <FontAwesomeIcon icon={faLock} />
            </div>

            <input
              ref={(el) => {
    adminInputRefs.current[2] = el;
}}
              name="password"
              type={
                mostrarContrasenasAdmin
                  ? "text"
                  : "password"
              }
              placeholder="Contraseña"
              value={formAdmin.password}
              onChange={handleAdminChange}
              onKeyDown={(e) => moverAdminConEnter(e, 2)}
              className="formInput"
              required
            />

            <button
              type="button"
              className="passwordEyeBtn"
              onClick={() =>
                setMostrarContrasenasAdmin(
                  (prev) => !prev
                )
              }
            >
              <FontAwesomeIcon
                icon={
                  mostrarContrasenasAdmin
                    ? faEye
                    : faEyeSlash
                }
              />
            </button>

          </div>

          {/* Reglas de la contraseña */}

          <div className="adminPasswordRules">

            <div className={cumpleLongitud ? "ok" : ""}>
              {cumpleLongitud ? "✓" : "✗"} Mínimo 8 caracteres
            </div>

            <div className={cumpleMayuscula ? "ok" : ""}>
              {cumpleMayuscula ? "✓" : "✗"} Al menos una mayúscula
            </div>

            <div className={cumpleMinuscula ? "ok" : ""}>
              {cumpleMinuscula ? "✓" : "✗"} Al menos una minúscula
            </div>

            <div className={cumpleSimbolo ? "ok" : ""}>
              {cumpleSimbolo ? "✓" : "✗"} Al menos un símbolo
            </div>

            <div className={cumpleRepeticion ? "ok" : ""}>
              {cumpleRepeticion ? "✓" : "✗"} Las contraseñas coinciden
            </div>

          </div>

          {/* Repetir contraseña */}

          <div className="inputWrapper">

            <div className="inputIcon">
              <FontAwesomeIcon icon={faLock} />
            </div>

            <input
              ref={(el) => {
                adminInputRefs.current[3] = el;
              }}
              name="repetirPassword"
              type={
                mostrarContrasenasAdmin
                  ? "text"
                  : "password"
              }
              placeholder="Repetir contraseña"
              value={formAdmin.repetirPassword}
              onChange={handleAdminChange}
              onKeyDown={(e) => moverAdminConEnter(e, 3)}
              className="formInput"
              required
            />

          </div>

        </div>

        {/* =======================================
            PIE DEL MODAL
        ======================================== */}

        <div className="modalFooter">

          <button
    type="button"
    className="cancelBtn"
    onClick={cancelarFormularioAdmin}
>
    Cancelar
</button>

          <button
            type="submit"
            className="saveBtn"
          >
            {editandoAdminId
              ? "Actualizar"
              : "Guardar"}
          </button>

        </div>

      </form>

    </div>
  );
}