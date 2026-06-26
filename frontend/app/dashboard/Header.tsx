//HEADER DEL SISTEMA MANEJA LA BARRA SUPERIOR CON LOGOTIPOS

"use client";


// IMPORTACIONES
 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";

import {
  faUser,
  faRightFromBracket,
  faXmark,
  faUsers,
  faLock,
} from "@fortawesome/free-solid-svg-icons";


// PROPIEDADES DEL COMPONENTE

type HeaderProps = {
  logueado: boolean;
  usuario: string;
  password: string;
  nombreUsuario: string;
  rol: string;
  mostrarMenuUsuario: boolean;
  setMostrarMenuUsuario: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  mostrarLogin: boolean;
  setMostrarLogin: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  abrirAdministradoresRegistrados: () => void;
  cerrarSesion: () => void;
  login: () => void;
  setUsuario: React.Dispatch<
    React.SetStateAction<string>
  >;

  setPassword: React.Dispatch<
    React.SetStateAction<string>
  >;
};


// COMPONENTE

export default function Header({
  logueado,
  usuario,
  password,
  nombreUsuario,
  rol,
  abrirAdministradoresRegistrados,
  mostrarMenuUsuario,
  setMostrarMenuUsuario,
  mostrarLogin,
  setMostrarLogin,
  cerrarSesion,
  login,
  setUsuario,
  setPassword,
}: HeaderProps) {


//COMENTAR

const menuRef = useRef<HTMLDivElement>(null);
const loginRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {


// CERRAR MENÚ DE USUARIO

if (
  mostrarMenuUsuario &&
     menuRef.current &&
    !menuRef.current.contains(event.target as Node)
  ) {

    setMostrarMenuUsuario(false);
    }


// CERRAR FORMULARIO DE LOGIN

if (
  mostrarLogin &&
    loginRef.current &&
    !loginRef.current.contains(event.target as Node)
  ) {

    setMostrarLogin(false);
    }
}

  document.addEventListener(
    "mousedown",
      handleClickOutside
  );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

}, [
    mostrarMenuUsuario,
    mostrarLogin,
    setMostrarMenuUsuario,
    setMostrarLogin
]);

  return (

    <>


{/* BARRA SUPERIOR */}

<div className="topBar">

        
{/* LOGOTIPOS */}

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


{/* USUARIO / LOGIN */}

  <div style={{ position: "relative" }}>
    {logueado ? (

            
// MENÚ DEL USUARIO
               
  <div
    className="userMenuContainer"
    ref={menuRef}
>

  <button
    className="userProfileBtn"
    onClick={() =>
      setMostrarMenuUsuario(
      !mostrarMenuUsuario
      )
    }
  >


{/* AVATAR */}

<div className="userAvatar">
    <FontAwesomeIcon 
     icon={faUser} 
     />
</div>


{/* INFORMACIÓN */}

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


{/* FLECHA */}
  <span className="userArrow">
      ▼
  </span>
</button>


{/* MENÚ DESPLEGABLE */}

{mostrarMenuUsuario && (
  <div className="userDropdown">

    <button
      className="dropdownItem"
      onClick={() => {
        setMostrarMenuUsuario(false);
        abrirAdministradoresRegistrados();
      }}
    >

        <FontAwesomeIcon icon={faUsers} />
          Ver administradores registrados
    </button>

    <button
      className="dropdownItem"
      onClick={() => {
        setMostrarMenuUsuario(false);
        cerrarSesion();
      }}
    >
        <FontAwesomeIcon icon={faRightFromBracket} />
            Cerrar sesión
    </button>
  </div>
)}

</div>

) : (


// LOGIN
           
    <>

{/* BOTÓN */}

      <button
        className="loginIconBtn"
        onClick={() =>
          setMostrarLogin(!mostrarLogin)
        }
      >
        <FontAwesomeIcon icon={faUser} />
      </button>


{/* FORMULARIO */}

{mostrarLogin && (
 <form
    ref={loginRef}
    className="loginBox"
    onSubmit={(e) => {
        e.preventDefault();
        login();
    }}
>


<div className="loginInputs">

{/* USUARIO */}

<div className="inputGroup">
  <FontAwesomeIcon
    icon={faUser}
    className="inputIcon"
/>

  <input
    type="text"
    placeholder="Usuario"
    value={usuario}
    onChange={(e)=>setUsuario(e.target.value)}
    autoComplete="username"
    required
  />
</div>


{/* CONTRASEÑA */}

<div className="inputGroup">
  <FontAwesomeIcon
    icon={faLock}
    className="inputIcon"
/>

  <input
    type="password"
    placeholder="Contraseña"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    autoComplete="current-password"
    required
  />
</div>

  <button
    type="submit"
    className="btnLogin"
  >
    Iniciar sesión
  </button>
</div>
</form>
)}
</>
)}
</div>
</div>
</>
);
}