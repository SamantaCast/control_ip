"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEye,
  faEyeSlash,
  faRightFromBracket,
  faUser,
  faPenToSquare,
  faTrash,
  faXmark,
  faUsers,
  faUserPlus,
  faClipboardList,
  faBuilding,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import {
  faLocationDot,
  faEnvelope,
  faDesktop,
  faNetworkWired,
  faBarcode
} from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";


type Impresora = {
  _id?: string;
  departamento: string;
  edificio: string;
  ubicacion: string;
  nombre: string;
  email: string;
  equipo: string;
  usuario: string;
  ip: string;
  codigo: string;
};

type UsuarioAdmin = {
  _id?: string;
  usuario: string;
  rol: string;
};

const vacioImpresora: Impresora = {
  departamento: "",
  edificio: "",
  ubicacion: "",
  nombre: "",
  email: "",
  equipo: "",
  usuario: "",
  ip: "",
  codigo: ""
};

export default function Page() {
  // LOGIN
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [rol, setRol] = useState("");

  // CONTADORES
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [coincidencias, setCoincidencias] = useState(0);

  // BUSCADOR
  const [busqueda, setBusqueda] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState("");

  // IMPRESORAS
  const [impresoras, setImpresoras] = useState<Impresora[]>([]);

  // FORMULARIO IMPRESORAS
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Impresora>(vacioImpresora);

  const [mostrarLogin, setMostrarLogin] = useState(false);



  // ADMINISTRADORES
  const [administradores, setAdministradores] = useState<UsuarioAdmin[]>([]);
  const [mostrarAdmins, setMostrarAdmins] = useState(false);
  const [editandoAdminId, setEditandoAdminId] = useState<string | null>(null);
  const [mostrarContrasenasAdmin, setMostrarContrasenasAdmin] = useState(false);

  // ADMINISTRADORES REGISTRADOS
  const [administradoresRegistrados, setAdministradoresRegistrados] = useState<UsuarioAdmin[]>([]);
  const [mostrarAdministradoresRegistrados, setMostrarAdministradoresRegistrados] = useState(false);

  const adminInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  

const moverAdminConEnter = (
  e: React.KeyboardEvent<HTMLInputElement>,
  index: number
) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const siguiente = adminInputRefs.current[index + 1];

    if (siguiente) {
      siguiente.focus();
    } else {
      guardarAdmin();
    }
  }
};

  const [formAdmin, setFormAdmin] = useState({
    usuario: "",
    passwordActual: "",
    password: "",
    repetirPassword: "",
    rol: "admin"
  });

  // SESIÓN
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const rolGuardado = localStorage.getItem("rol");

    cargarImpresoras("", "");

    if (tokenGuardado) {
      setToken(tokenGuardado);
      setRol(rolGuardado || "");
      setLogueado(true);

      if (rolGuardado === "admin") {
        cargarAdministradores(tokenGuardado);
      }
    }
  }, []);

  // TOKEN
  const authHeader = (tok: string) => ({
    headers: {
      Authorization: `Bearer ${tok}`
    }
  });
  // LOGIN
  const login = async () => {

      if (!usuario.trim()) {
        return;
      }

      if (!password.trim()) {
        return;
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/login`,
          {
            usuario: usuario.trim(),
            password: password.trim()
          }
        );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);

      setToken(res.data.token);
      setRol(res.data.rol);
      setLogueado(true);

      setMostrarLogin(false);

      cargarImpresoras("", "");


      if (res.data.rol === "admin") {
        cargarAdministradores(res.data.token);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario y/o contraseña incorrectos.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });
    }
  };
  // CARGAR IMPRESORAS
const cargarImpresoras = async (tok: string, textoBusqueda: string) => {
  try {
    const config = tok ? authHeader(tok) : {};

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?busqueda=${encodeURIComponent(textoBusqueda)}`,
      config
    );

setImpresoras(res.data);
setCoincidencias(res.data.length);
if (textoBusqueda === "") {
  setTotalRegistros(res.data.length);
}
  } catch (error) {
    console.log("Error al cargar impresoras", error);
  }
};

//TOTAL DE REGISTROS//
const actualizarTotalRegistros = async () => {
  try {
    const config = token ? authHeader(token) : {};

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras`,
      config
    );

    setTotalRegistros(res.data.length);

  } catch (error) {
    console.log(error);
  }
};

  // BUSCAR
  const buscar = async () => {
    try {
      const texto = busqueda.trim();
      const edificio = filtroEdificio.trim();

      const config = token ? authHeader(token) : {};

     const res = await axios.get(
  `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?busqueda=${encodeURIComponent(texto)}&edificio=${encodeURIComponent(edificio)}`,
  config
);

setImpresoras(res.data);
setCoincidencias(res.data.length);

  if (res.data.length === 0) {
    await Swal.fire({
      icon: "info",
      title: "Sin resultados",
      text: "No se encontraron registros.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar"
    });
  }
} catch (error) {
  console.log(error);
  await Swal.fire({
    icon: "error",
    title: "Error",
    text: "Error al buscar.",
    confirmButtonColor: "#8A2036",
    confirmButtonText: "Aceptar"
  });
}
};

  // NUEVO REGISTRO
const abrirNuevo = () => {
  setEditandoId(null);
  setForm(vacioImpresora);
  setMostrarFormulario(true);
};
  // EDITAR REGISTRO
  const abrirEditar = (imp: Impresora) => {
    setEditandoId(imp._id || null);
    setForm({
      departamento: imp.departamento || "",
      edificio: imp.edificio || "",
      ubicacion: imp.ubicacion || "",
      nombre: imp.nombre || "",
      email: imp.email || "",
      equipo: imp.equipo || "",
      usuario: imp.usuario || "",
      ip: imp.ip || "",
      codigo: imp.codigo || ""
    });
    setMostrarFormulario(true);
  };
  // CAMBIOS FORMULARIO
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // GUARDAR IMPRESORA
  const guardar = async () => {
     if (!form.departamento.trim() || !form.nombre.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        html: `
          Faltan datos obligatorios.<br>
          (Nombre y/o Departamento)
        `,
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });
    return;
  }
    try {
      if (editandoId) {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/${editandoId}`,
        form,
        authHeader(token)
      );
      Swal.fire({
      icon: "success",
      title: "Registro actualizado",
      text: "Los cambios fueron guardados correctamente.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar"
    });

    } else {

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras`,
        form,
        authHeader(token)
      );

      Swal.fire({
      icon: "success",
      title: "Registro agregado",
      text: "El registro fue agregado correctamente.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar"
    });
    }

      setMostrarFormulario(false);
      setEditandoId(null);
      setForm(vacioImpresora);

      await cargarImpresoras(token, busqueda);
await actualizarTotalRegistros();

    } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo guardar el registro.",
          confirmButtonColor: "#8A2036",
          confirmButtonText: "Aceptar"
        });
      }
  };

  // ELIMINAR REGISTRO
  const eliminar = async (id?: string) => {
    if (!id) return;

    const confirmar = await Swal.fire({
      title: "¿Eliminar registro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8A2036",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!confirmar.isConfirmed) return;

    try {
      await axios.delete(
  `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/${id}`,
  authHeader(token)
);
      Swal.fire({
      icon: "success",
      title: "Registro eliminado",
      text: "El registro fue eliminado correctamente.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar"
    });

      await cargarImpresoras(token, busqueda);
await actualizarTotalRegistros();
    
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el registro.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });
    }
  };

  // CARGAR ADMINS
  const cargarAdministradores = async (tok: string) => {
    try {
  const res = await axios.get(
  `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
  authHeader(tok)
);

      setAdministradores(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  // CARGAR ADMINISTRADORES REGISTRADOS
  const cargarAdministradoresRegistrados = async (tok: string) => {
    try {
      const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
      authHeader(tok)
    );
      setAdministradoresRegistrados(res.data);
      setMostrarAdministradoresRegistrados(true);
    } catch (error) {
      console.log(error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar administradores.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });
    }
  };

  // NUEVO ADMIN
  const abrirNuevoAdmin = () => {
    setMostrarContrasenasAdmin(false);
    setMostrarAdministradoresRegistrados(false);
    setEditandoAdminId(null);
    setFormAdmin({
      usuario: "",
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: "admin"
    });
    setMostrarAdmins(true);
  };

  // EDITAR ADMIN
  const abrirEditarAdmin = (admin: UsuarioAdmin) => {
    setMostrarContrasenasAdmin(false);
    setMostrarAdministradoresRegistrados(false);
    setEditandoAdminId(admin._id || null);
    setFormAdmin({
      usuario: admin.usuario,
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: admin.rol
    });
    setMostrarAdmins(true);
  };

  // CAMBIOS ADMIN
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormAdmin({
      ...formAdmin,
      [e.target.name]: e.target.value
    });
  };
  // VALIDAR PASSWORD
  const passwordValida = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(pass);
  };
  const passwordActualTexto = formAdmin.password;
  const cumpleLongitud = passwordActualTexto.length >= 8;
  const cumpleMayuscula = /[A-Z]/.test(passwordActualTexto);
  const cumpleMinuscula = /[a-z]/.test(passwordActualTexto);
  const cumpleSimbolo = /[^A-Za-z0-9]/.test(passwordActualTexto);
  const cumpleRepeticion =
    formAdmin.repetirPassword.length > 0 &&
    formAdmin.password === formAdmin.repetirPassword;

  // GUARDAR ADMIN
  const guardarAdmin = async () => {
  try {

    if (formAdmin.password !== formAdmin.repetirPassword) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });

      return;
    }

    if (!passwordValida(formAdmin.password)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña inválida",
        text: "Debe contener mayúscula, minúscula, símbolo y mínimo 8 caracteres.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });

      return;
    }

    if (editandoAdminId) {

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${editandoAdminId}`,
        formAdmin,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Administrador actualizado",
        text: "Los cambios fueron guardados correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });

    } else {

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        formAdmin,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Administrador creado",
        text: "El administrador fue registrado correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });

    }

    setEditandoAdminId(null);

    setFormAdmin({
      usuario: "",
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: "admin"
    });

    await cargarAdministradores(token);
    await cargarAdministradoresRegistrados(token);

    setMostrarAdmins(false);
    setMostrarAdministradoresRegistrados(true);

  } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "No se pudo guardar el administrador.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });
    }
};



  // ELIMINAR ADMIN
  const eliminarAdmin = async (id?: string) => {
    if (!id) return;

    const confirmar = await Swal.fire({
    title: "¿Eliminar administrador?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#8A2036",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirmar.isConfirmed) return;

    try {
     await axios.delete(
  `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
  authHeader(token)
);
      setAdministradores((prev) => prev.filter((admin) => admin._id !== id));
      setAdministradoresRegistrados((prev) =>
        prev.filter((admin) => admin._id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Administrador eliminado",
        text: "El administrador fue eliminado correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });

      await cargarAdministradores(token);
      await cargarAdministradoresRegistrados(token);
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "Error administrador",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar"
      });
    }
  };

  // CERRAR FORMULARIO ADMIN
  const cerrarFormularioAdmin = () => {
    setMostrarAdmins(false);
    setEditandoAdminId(null);
    setMostrarAdministradoresRegistrados(true);
    setMostrarContrasenasAdmin(false);
  };

  // CERRAR SESIÓN
  const cerrarSesion = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    setUsuario("");
    setPassword("");

    setToken("");
    setRol("");
    setLogueado(false);

    setBusqueda("");
    setFiltroEdificio("");

    setImpresoras([]);
    setCoincidencias(0);
    setTotalRegistros(0);
    setAdministradores([]);

    setMostrarAdmins(false);
    setMostrarFormulario(false);
    setMostrarAdministradoresRegistrados(false);

    setForm(vacioImpresora);

    setFormAdmin({
      usuario: "",
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: "admin"
    });

    setMostrarContrasenasAdmin(false);

    await cargarImpresoras("", "");
  }; 

return (
  <>
    <div className="topBar">

      <div className="logosLeft">

        <img
          src="/logos/1.png"
          alt="Logo 1"
          className="topLogo"
        />

        <span className="logoDivider">|</span>

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

      <div style={{ position: "relative" }}>

        {logueado ? (

  <>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 5
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}
      >

        <button
        className="logoutIconBtn"
        onClick={cerrarSesion}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>

      </div>

    </div>

  </>
        ) : (
          
         <>
        <button
          onClick={() => setMostrarLogin(!mostrarLogin)}
          className="loginIconBtn"
        >
          <FontAwesomeIcon icon={faUser} />
        </button>

        {mostrarLogin && (
          <form
              className="loginBox"
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
            <button
              type="button"
              onClick={() => setMostrarLogin(false)}
              className="closeLoginBtn"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

           <input
            className="loginInput"
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <input
            className="loginInput"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button
          type="submit"
          className="loginBtn"
        >
          Iniciar Sesión
        </button>
          </form>
        )}
      </>
      

        )}

      </div>

    </div>
 <div className="panel">
<div className="panelHeader">
  <div className="headerTopRow">
    <div className="panelTitle">
      Control Equipos de Cómputo
    </div>

    {logueado && (
      <div className="adminActions">
        <span className="adminRole">
          Rol: {rol}
        </span>

        {rol === "admin" && (
          <button
            className="adminsIconBtn"
            onClick={() => cargarAdministradoresRegistrados(token)}
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
        )}
      </div>
    )}
  </div>

      <form
      className="panelSearch"
      onSubmit={(e) => {
        e.preventDefault();
        buscar();
      }}
    >
      <input
        type="text"
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="searchInput"
      />

      <input
        type="text"
        placeholder="Edificio..."
        value={filtroEdificio}
        onChange={(e) => setFiltroEdificio(e.target.value)}
        className="searchInput"
      />

      <button
        type="submit"
        className="btnBuscar"
      >
        Buscar
      </button>

   <button
    type="button"
    className="showAllBtn"
    onClick={() => {
      setBusqueda("");
      setFiltroEdificio("");
      cargarImpresoras(token, "");
    }}
  >
    Ver todos
  </button>
    </form>
</div>
        <div className="panelContent">
          <div className="panelTop">
          <div className="panelCounters">
            <span>Total de registros: {totalRegistros}</span>
            <span>Coincidencias encontradas: {coincidencias}</span>
          </div>
          {logueado && (
    <button
      className="adminNewBtn"
      onClick={abrirNuevo}
    >
      ＋ Nuevo registro
    </button>
)}
        </div>
          <div className="tableBox">
            <table className="dataTable">
              <thead>
                <tr>
                  <th className="tableHeadCell">Departamento</th>
                  <th className="tableHeadCell">Edificio</th>
                  <th className="tableHeadCell">Ubicación</th>
                  <th className="tableHeadCell">Nombre</th>
                  <th className="tableHeadCell">Email</th>
                  <th className="tableHeadCell">Equipo</th>
                  <th className="tableHeadCell">Usuario</th>
                  <th className="tableHeadCell">IP</th>
                  <th className="tableHeadCell">Código</th>
                  {logueado && <th className="tableHeadCell">Acciones</th>}
                </tr>
              </thead>

              <tbody>
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
                  impresoras.map((imp) => (
                    <tr key={imp._id}>
                      <td className="tableCell">{imp.departamento}</td>
                      <td className="tableCell">{imp.edificio}</td>
                      <td className="tableCell">{imp.ubicacion}</td>
                      <td className="tableCell">{imp.nombre}</td>
                      <td className="tableCell">{imp.email}</td>
                      <td className="tableCell">{imp.equipo}</td>
                      <td className="tableCell">{imp.usuario}</td>
                      <td className="tableCell">{imp.ip}</td>
                      <td className="tableCell">{imp.codigo}</td>

                     {logueado && (
                        <td className="tableCell">

                          <div className="actionBtns">

                            <button
                              className="iconBtn editBtn"
                              onClick={() => abrirEditar(imp)}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>

                            <button
                              className="iconBtn deleteBtn"
                              onClick={() => eliminar(imp._id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
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
        </div>
      </div>


{/*FORMULARIO AGREGAR/EDITAR IMPRESORA*/}

 {mostrarFormulario && (
  <div className="overlayStyle">
    <div className="modalStyle">
      <div className="modalHeader">
        <div className="modalHeaderIcon">
          <FontAwesomeIcon icon={faClipboardList} />
        </div>

        <div>
          <h2 className="modalTitle">
            {editandoId ? "Editar registro" : "Agregar registro"}
          </h2>

          <p className="modalDescription">
            Complete la información correspondiente al equipo de cómputo.
          </p>
        </div>

      </div>

      <div className="modalDivider"></div>

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

      <div className="formSection">
        <div className="sectionHeader">
        <div className="sectionIcon">
          <FontAwesomeIcon icon={faClipboardList} />
        </div>
        <h3 className="sectionTitle">
          Datos Generales
        </h3>
      </div>

        <div className="formGrid">
         <div className="inputWrapper">
          <div className="inputIcon">
            <FontAwesomeIcon icon={faBuilding} />
          </div>
          <input
            name="departamento"
            placeholder="Escribe departamento"
            value={form.departamento}
            onChange={handleChange}
            className="formInput"
          />

        </div>
         <div className="inputWrapper">
          <div className="inputIcon">
            <FontAwesomeIcon icon={faBuilding} />
          </div>

          <input
            name="edificio"
            placeholder="Edificio"
            value={form.edificio}
            onChange={handleChange}
            className="formInput"
          />
        </div>
          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faLocationDot} 
            />
            </div>

            <input
              name="ubicacion"
              placeholder="Ubicación"
              value={form.ubicacion}
              onChange={handleChange}
              className="formInput"
            />
          </div>
        </div>
      </div>

      <div className="formSection">
        <div className="sectionHeader">
          <div className="sectionIcon">
            <FontAwesomeIcon icon={faUser} />
          </div>

          <h3 className="sectionTitle">
            Responsable
          </h3>
        </div>

        <div className="formGrid">

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              className="formInput"
            />
          </div>

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="formInput"
            />
          </div>

          <div className="inputWrapper">
            <div className="inputIcon">
              <FontAwesomeIcon icon={faUser} />
            </div>

            <input
              name="usuario"
              placeholder="Usuario"
              value={form.usuario}
              onChange={handleChange}
              className="formInput"
            />
          </div>

        </div>

      </div>

      <div className="formSection">
      <div className="sectionHeader">
        <div className="sectionIcon">
          <FontAwesomeIcon icon={faDesktop} />
        </div>

        <h3 className="sectionTitle">
          Equipo
        </h3>
      </div>

      <div className="formGrid">

        <div className="inputWrapper">
          <div className="inputIcon">
            <FontAwesomeIcon icon={faDesktop} />
          </div>

          <input
            name="equipo"
            placeholder="Equipo"
            value={form.equipo}
            onChange={handleChange}
            className="formInput"
          />
        </div>

        <div className="inputWrapper">
          <div className="inputIcon">
            <FontAwesomeIcon icon={faNetworkWired} />
          </div>

          <input
            name="ip"
            placeholder="IP"
            value={form.ip}
            onChange={handleChange}
            className="formInput"
          />
        </div>

        <div className="inputWrapper">
          <div className="inputIcon">
            <FontAwesomeIcon icon={faBarcode} />
          </div>

          <input
            name="codigo"
            placeholder="Código"
            value={form.codigo}
            onChange={handleChange}
            className="formInput"
          />
        </div>

      </div>
    </div>

      <div className="modalFooter">
        <button
          type="button"
          className="cancelBtn"
          onClick={()=>{
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
          {editandoId ? "Actualizar" : "Guardar"}
        </button>

      </div>
    </div>
  </div>
)}

   {rol === "admin" && mostrarAdmins && (
  <div className="overlayStyle">
    <form
      className="adminModalStyle"
      onSubmit={(e) => {
        e.preventDefault();
        guardarAdmin();
      }}
    >

      <div className="modalHeader">

      <div className="modalHeaderIcon">
        <FontAwesomeIcon icon={faUsers} />
      </div>

      <div>
        <h2 className="modalTitle">
          {editandoAdminId
            ? "Editar administrador"
            : "Nuevo administrador"}
        </h2>

        <p className="modalDescription">
          Capture la información del administrador.
        </p>
      </div>

    </div>

    <div className="modalDivider"></div>

      <button
        type="button"
        className="adminCloseBtn"
        onClick={cerrarFormularioAdmin}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

    <div className="formSection">


  {/* USUARIO */}

  
    <div className="inputWrapper">

    <div className="inputIcon">
      <FontAwesomeIcon icon={faUser} />
    </div>

    <input
      ref={(el) => {
        adminInputRefs.current[0] = el;
      }}
      name="usuario"
      placeholder="Usuario"
      value={formAdmin.usuario}
      onChange={handleAdminChange}
      onKeyDown={(e) => moverAdminConEnter(e, 0)}
      className="formInput"
      autoComplete="username"
      required
    />

  </div>

  {/* CONTRASEÑA */}
  <div className="inputWrapper">

    <div className="inputIcon">
      <FontAwesomeIcon icon={faLock} />
    </div>

    <input
      ref={(el) => {
        adminInputRefs.current[1] = el;
      }}
      name="password"
      type={mostrarContrasenasAdmin ? "text" : "password"}
      placeholder="Contraseña"
      value={formAdmin.password}
      onChange={handleAdminChange}
      onKeyDown={(e) => moverAdminConEnter(e, 1)}
      className="formInput"
      required
    />

    <button
      type="button"
      className="passwordEyeBtn"
      onClick={() =>
        setMostrarContrasenasAdmin((prev) => !prev)
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

  {/* REGLAS DE CONTRASEÑA */}
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

  {/* REPETIR CONTRASEÑA */}
  <div className="inputWrapper">

    <div className="inputIcon">
      <FontAwesomeIcon icon={faLock} />
    </div>

    <input
      ref={(el) => {
        adminInputRefs.current[2] = el;
      }}
      name="repetirPassword"
      type={mostrarContrasenasAdmin ? "text" : "password"}
      placeholder="Repetir contraseña"
      value={formAdmin.repetirPassword}
      onChange={handleAdminChange}
      onKeyDown={(e) => moverAdminConEnter(e, 2)}
      className="formInput"
      required
    />

  </div>

</div>



























      <div className="modalFooter">
      <button
        type="button"
        className="cancelBtn"
        onClick={cerrarFormularioAdmin}
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
)}

{rol === "admin" && mostrarAdministradoresRegistrados && (
  <div className="overlayStyle">
    <div className="adminListModal">

      <div className="modalHeader">
        <div>
          <h2 className="modalTitle">
            Administradores
          </h2>

          <p className="modalDescription">
            Administradores registrados.
          </p>
        </div>
      </div>

      <div className="modalDivider"></div>

      <button
        className="adminCloseBtn"
        onClick={() => setMostrarAdministradoresRegistrados(false)}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className="adminListBody">

        <p className="adminListTotal">
          Total: {administradoresRegistrados.length}
        </p>

        <div className="adminTableBox">
          <table className="adminDataTable">
            <thead>
              <tr>
                <th className="adminHeadCell">Usuario</th>
                <th className="adminHeadCell">Rol</th>
                <th className="adminHeadCell">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {administradoresRegistrados.map((admin) => (
                <tr key={admin._id}>
                  <td className="adminCell">{admin.usuario}</td>

                  <td className="adminCell">{admin.rol}</td>

                  <td className="adminCell">
                    <div className="adminActionBtns">

                      <button
                        className="adminIconBtn editBtn"
                        onClick={() => abrirEditarAdmin(admin)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>

                      <button
                        className="adminIconBtn deleteBtn"
                        onClick={() => eliminarAdmin(admin._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <button
          className="adminNewBtn"
          onClick={abrirNuevoAdmin}
        >
          Nuevo registro
        </button>

      </div>
    </div>
  </div>
)}
  </>
);
}