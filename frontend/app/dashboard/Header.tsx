"use client";

/* ==================================================
   IMPORTACIONES
================================================== */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faUserPlus,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

/* ==================================================
   PROPIEDADES DEL COMPONENTE
================================================== */

type HeaderProps = {
  /* Estado de sesión */
  logueado: boolean;

  /* Información del usuario */
  usuario: string;
  password: string;
  nombreUsuario: string;
  rol: string;

  /* Menú del usuario */
  mostrarMenuUsuario: boolean;
  setMostrarMenuUsuario: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  /* Login */
  mostrarLogin: boolean;
  setMostrarLogin: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  /* Funciones */
  abrirNuevoAdmin: () => void;
  cerrarSesion: () => void;
  login: () => void;

  /* Estados del formulario */
  setUsuario: React.Dispatch<
    React.SetStateAction<string>
  >;

  setPassword: React.Dispatch<
    React.SetStateAction<string>
  >;
};

/* ==================================================
   COMPONENTE
================================================== */

export default function Header({
  logueado,

  usuario,
  password,
  nombreUsuario,
  rol,

  mostrarMenuUsuario,
  setMostrarMenuUsuario,

  mostrarLogin,
  setMostrarLogin,

  abrirNuevoAdmin,
  cerrarSesion,

  login,

  setUsuario,
  setPassword,
}: HeaderProps) {

  return (
    <>
      {/* ===========================================
          BARRA SUPERIOR
      ============================================ */}

      <div className="topBar">

        {/* =======================================
            LOGOTIPOS
        ======================================== */}

        <div className="logosLeft">

          <img
            src="/logos/1.png"
            alt="Logo 1"
            className="topLogo"
          />

          <span className="logoDivider">
            |
          </span>

          <img
            src="/logos/2.png"
            alt="Logo 2"
            className="topLogo"
          />

          <img
            src="/logos/3.png"
            alt="Logo 3"
            className="topLogo"
          />

        </div>

        {/* =======================================
            USUARIO / LOGIN
        ======================================== */}

        <div style={{ position: "relative" }}>

          {logueado ? (

            /* ===================================
               MENÚ DEL USUARIO
            ==================================== */

            <div className="userMenuContainer">

              <button
                className="userProfileBtn"
                onClick={() =>
                  setMostrarMenuUsuario(
                    !mostrarMenuUsuario
                  )
                }
              >

                {/* Avatar */}

                <div className="userAvatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>

                {/* Información */}

                <div className="userInfo">

                  <span className="userName">
                    {(nombreUsuario ||
                      usuario ||
                      "ADMIN").toUpperCase()}
                  </span>

                  <span className="userRole">
                    Rol: {(rol || "").toUpperCase()}
                  </span>

                </div>

                {/* Flecha */}

                <span className="userArrow">
                  ▼
                </span>

              </button>

              {/* ===================================
                  MENÚ DESPLEGABLE
              ==================================== */}

              {mostrarMenuUsuario && (

                <div className="userDropdown">

                  <button
                    className="dropdownItem"
                    onClick={() => {
                      abrirNuevoAdmin();
                      setMostrarMenuUsuario(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUserPlus}
                    />

                    Agregar nuevo administrador

                  </button>

                  <button
                    className="dropdownItem"
                    onClick={cerrarSesion}
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                    />

                    Cerrar sesión

                  </button>

                </div>

              )}

            </div>

          ) : (

            /* ===================================
               LOGIN
            ==================================== */

            <>

              {/* Botón */}

              <button
                className="loginIconBtn"
                onClick={() =>
                  setMostrarLogin(!mostrarLogin)
                }
              >
                <FontAwesomeIcon icon={faUser} />
              </button>

              {/* Formulario */}

              {mostrarLogin && (

                <form
                  className="loginBox"
                  onSubmit={(e) => {
                    e.preventDefault();
                    login();
                  }}
                >

                  {/* Cerrar */}

                  <button
                    type="button"
                    className="closeLoginBtn"
                    onClick={() =>
                      setMostrarLogin(false)
                    }
                  >
                    <FontAwesomeIcon
                      icon={faXmark}
                    />
                  </button>

                  {/* Usuario */}

                  <input
                    className="loginInput"
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) =>
                      setUsuario(e.target.value)
                    }
                    autoComplete="username"
                    required
                  />

                  {/* Contraseña */}

                  <input
                    className="loginInput"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />

                  {/* Botón */}

                  <button
                    type="submit"
                    className="loginBtn"
                  >
                    Iniciar sesión
                  </button>

                </form>

              )}

            </>

          )}

        </div>

      </div>

    </>
  );
}