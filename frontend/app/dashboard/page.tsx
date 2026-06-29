// COMPONENTE PRINCIPAL DE LA APLICACIÓN

"use client";


// IMPORTACIONES

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import EquipmentTable from "./EquipmentTable";
import Pagination from "./Pagination";
import EquipmentModal from "./EquipmentModal";
import AdminModal from "./AdminModal";
import AdminListModal from "./AdminListModal";
import "../../styles/dashboard.css";
import "../../styles/forms.css";
import "../../styles/modal.css";
import "../../styles/table.css";
import "../../styles/pagination.css";
import "../../styles/user-menu.css";
import "../../styles/searchbar.css";
import type {Impresora, UsuarioAdmin, FormAdmin, } from "./types";
import { exportarExcel } from "../utils/exportExcel";
import { exportarPDF } from "../utils/exportPDF";


// CONSTANTES

const vacioImpresora: Impresora = {
  departamento: "",
  edificio: "",
  ubicacion: "",
  nombre: "",
  email: "",
  equipo: "",
  usuario: "",
  ip: "",
  codigo: "",
};


// COMPONENTE PRINCIPAL

export default function Page() {


// ESTADOS DEL LOGIN
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [logueado, setLogueado] = useState(false);
  const [rol, setRol] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);


// CONTADORES

  const [totalRegistros, setTotalRegistros] = useState(0);
  const [coincidencias, setCoincidencias] = useState(0);


// BUSCADOR

  const [busqueda, setBusqueda] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState("");
  const [filtroDepartamento, setFiltroDepartamento] = useState("");
  const [filtroUbicacion, setFiltroUbicacion] = useState("");
  const [filtroEquipo, setFiltroEquipo] = useState("");


// FILTROS

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [ubicaciones, setUbicaciones] = useState<string[]>([]);
  const [equipos, setEquipos] = useState<string[]>([]);
  const [edificios, setEdificios] = useState<string[]>([]);


// IMPRESORAS

  const [impresoras, setImpresoras] = useState<Impresora[]>([]);

// FORMULARIO DE IMPRESORAS

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] =
    useState<Impresora>(vacioImpresora);


// ADMINISTRADORES
  
  const [administradores, setAdministradores] =
    useState<UsuarioAdmin[]>([]);
  const [administradoresRegistrados, setAdministradoresRegistrados] =
    useState<UsuarioAdmin[]>([]);
  const [mostrarAdmins, setMostrarAdmins] =
    useState(false);

  const [
    mostrarAdministradoresRegistrados,
    setMostrarAdministradoresRegistrados,
  ] = useState(false);

  const [editandoAdminId, setEditandoAdminId] =
    useState<string | null>(null);

  const [
    mostrarContrasenasAdmin,
    setMostrarContrasenasAdmin,
  ] = useState(false);


// REFERENCIAS CONTROL DE FOCO ENTRE INPUTS

  const adminInputRefs =
    useRef<(HTMLInputElement | null)[]>([]);


// FORMULARIO DE ADMINISTRADORES
 
  const [formAdmin, setFormAdmin] = useState({
    nombre: "",
    usuario: "",
    password: "",
    repetirPassword: "",
    passwordActual: ""
});


// NAVEGACIÓN ENTRE INPUTS DEL FORMULARIO ADMIN
 
  const moverAdminConEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const siguiente =
      adminInputRefs.current[index + 1];

    if (siguiente) {
      siguiente.focus();
    } else {
      guardarAdmin();
    }
  };


// ESTADÍSTICAS DEL DASHBOARD

  const [stats, setStats] = useState({
    totalEquipos: 0,
    equiposActivos: 0,
    totalUsuarios: 0,
    totalIPs: 0,
});


 // ORDENAMIENTO

  const [ordenCampo, setOrdenCampo] = useState("");
  const [ordenDireccion, setOrdenDireccion] =
    useState<"asc" | "desc">("asc");

  function ordenarPor(campo: string) {
    if (ordenCampo === campo) {
        setOrdenDireccion(
          ordenDireccion === "asc"
            ? "desc"
            : "asc"
        );

     } else {
        setOrdenCampo(campo);
        setOrdenDireccion("asc");
    }
}


// EXPORTAR A EXCEL y pdf

  const descargarExcel = () => {
    exportarExcel(impresoras);
  };

  const generarPDF = () => {
    exportarPDF(impresorasOrdenadas);
};


//ORDENAMIENTO DE REGISTROS

  const impresorasOrdenadas = [...impresoras].sort((a, b) => {
    if (!ordenCampo) return 0;

  const valorA = String(
    a[ordenCampo as keyof Impresora] ?? ""
  ).toLowerCase();

  const valorB = String(
    b[ordenCampo as keyof Impresora] ?? ""
  ).toLowerCase();

    if (valorA < valorB)
      return ordenDireccion === "asc" ? -1 : 1;

    if (valorA > valorB)
      return ordenDireccion === "asc" ? 1 : -1;

    return 0;
});


// PAGINACIÓN
 
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] =
    useState(15);


//DIVIDE LOS REGISTROS POR PÁGINA

  const totalPaginas = Math.ceil(
    impresoras.length / registrosPorPagina
  );

  const indiceInicio =
    (paginaActual - 1) * registrosPorPagina;

  const indiceFin =
    indiceInicio + registrosPorPagina;

  const impresorasPaginadas =
    impresorasOrdenadas.slice(
      indiceInicio,
      indiceFin
    );


// CARGA INICIAL
// RECUPERA LA SESIÓN ALMACENADA
// CARGA REGISTROS DEL SISTEMA
// SI ES ADMIN, CARGA LA LISTA DE USUARIOS
  
  useEffect(() => {
  const tokenGuardado =
    localStorage.getItem("token");

  const rolGuardado =
    localStorage.getItem("rol");

  const nombreGuardado =
    localStorage.getItem("nombre");
    cargarImpresoras("", "");
    cargarFiltros();
    cargarEdificios();
    cargarStats();

  if (!tokenGuardado) return;
    setToken(tokenGuardado);
    setRol(rolGuardado || "");
    setNombreUsuario(nombreGuardado || "");
    setLogueado(true);

  if (rolGuardado === "admin") {
    cargarAdministradores(tokenGuardado);
  }
}, []);

  useEffect(() => {
  const tiempo = setTimeout(() => {
    buscar();
  }, 300);

  return () => clearTimeout(tiempo);

}, [busqueda,
   filtroDepartamento,
   filtroEdificio,
   filtroUbicacion,
   filtroEquipo]);


// CABECERA DE AUTORIZACIÓN SE USA EN PETICIONES PROTEGIDAS
  
  const authHeader = (tok: string) => ({
    headers: {
    Authorization: `Bearer ${tok}`,
    },
  });


// CARGAR EDIFICIOS

const cargarEdificios = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/edificios`
    );

    const lista = res.data
      .filter((e: string) => e && e.trim() !== "")
      .sort((a: string, b: string) => a.localeCompare(b));
    setEdificios(lista);
  } catch (error) {
    console.log(error);
  }
};


// CARGAR ESTADÍSTICAS

const cargarStats = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/stats`
    );
      setStats(res.data);
  } catch (error) {
      console.error("Error al cargar estadísticas:", error);
  }
};


//CARGAR FILTROS

async function cargarFiltros() {
  try {
    const respuesta = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/filtros`
    );

    const datos = await respuesta.json();

    console.log(datos.departamentos);

    setDepartamentos(datos.departamentos);
    setEdificios(datos.edificios);
    setUbicaciones(datos.ubicaciones);
    setEquipos(datos.equipos);

  } catch (error) {
    console.error("Error cargando filtros", error);
  }
}


// INICIAR SESIÓN

const login = async () => {
  if (!usuario.trim()) return;
  if (!password.trim()) return;
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          usuario: usuario.trim(),
          password: password.trim(),
        }
      );
          
      
// LOGIN EXITOSO
   
console.log("LOGIN:", res.data);

// GUARDAR DATOS DE LA SESIÓN EN EL NAVEGADOR

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("rol", res.data.rol);
  localStorage.setItem("nombre", res.data.nombre);

//ACTUALIZAR ESTADOS DE LA APLICACIÓN

  setToken(res.data.token);
  setRol(res.data.rol);
  setNombreUsuario(res.data.nombre);
  setLogueado(true);
  setMostrarLogin(false);

// CARGAR LOS REGISTROS DISPONIBLES

  cargarImpresoras("", "");
  cargarFiltros();
  cargarEdificios();
  cargarStats();

// SI EL USUARIO ES ADMINISTRADOR, CARGAR LA LISTA DE ADMINISTRADORES

if (res.data.rol === "admin") {
  cargarAdministradores(res.data.token);
 }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario y/o contraseña incorrectos.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });
    }
  };


// CARGAR REGISTROS DE IMPRESORAS

const cargarImpresoras = async (
  tok: string,
  textoBusqueda: string
) => {
    try {
      const config = tok ? authHeader(tok) : {};
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?busqueda=${encodeURIComponent(
          textoBusqueda
      )}`,
        config
    );


// ACTUALIZAR LA TABLA

  setImpresoras(res.data);
  setCoincidencias(res.data.length);

  if (textoBusqueda === "") {
    setTotalRegistros(res.data.length);
  }

  } catch (error) {
    console.log("Error al cargar impresoras:", error);
    }
};


// BUSCAR REGISTROS
  
const buscar = async () => {
  try {
    const config = token ? authHeader(token) : {};

    const params = new URLSearchParams({
      busqueda: busqueda.trim(),
      departamento: filtroDepartamento,
      edificio: filtroEdificio,
      ubicacion: filtroUbicacion,
      equipo: filtroEquipo,

    });

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?${params.toString()}`,
        config
    );
        setImpresoras(res.data);
        setPaginaActual(1);
        setCoincidencias(res.data.length);
  } catch (error) {
    console.log(error);
  }
};


// ABRIR FORMULARIO PARA NUEVO REGISTRO
  
const abrirNuevo = () => {
  setEditandoId(null);
  setForm(vacioImpresora);
  setMostrarFormulario(true);
};


// ABRIR FORMULARIO PARA EDITAR REGISTRO
 
const abrirEditar = (imp: Impresora) => {
  setEditandoId(imp._id || null);

  setForm({
    _id: imp._id,
    departamento: imp.departamento || "",
    edificio: imp.edificio || "",
    ubicacion: imp.ubicacion || "",
    nombre: imp.nombre || "",
    email: imp.email || "",
    equipo: imp.equipo || "",
    usuario: imp.usuario || "",
    ip: imp.ip || "",
    codigo: imp.codigo || "",
  });

  setMostrarFormulario(true);
};


// ACTUALIZAR CAMPOS DEL FORMULARIO
 
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setForm({
  ...form,
  [e.target.name]: e.target.value,
  });
};


// GUARDAR O ACTUALIZAR REGISTRO
 
const guardar = async () => {


// VALIDAR CAMPOS OBLIGATORIOS

if (!form.departamento.trim() || !form.nombre.trim()) {
  await Swal.fire({
    icon: "warning",
    title: "Datos incompletos",
    html: `
      Faltan datos obligatorios.<br>
      (Nombre y/o Departamento)
      `,
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
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

        await Swal.fire({
          icon: "success",
          title: "Registro actualizado",
          text: "Los cambios fueron guardados correctamente.",
          confirmButtonColor: "#8A2036",
          confirmButtonText: "Aceptar",
        });

      } else {

        // CREAR UN NUEVO REGISTRO

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras`,
          form,
          authHeader(token)
        );

        await Swal.fire({
          icon: "success",
          title: "Registro agregado",
          text: "El registro fue agregado correctamente.",
          confirmButtonColor: "#8A2036",
          confirmButtonText: "Aceptar",
        });

      }

      // RESTABLECER EL FORMULARIO

      setMostrarFormulario(false);
      setEditandoId(null);
      setForm(vacioImpresora);

      // RECARGAR LA INFORMACIÓN

      await cargarImpresoras(token, busqueda);
      await cargarStats();

    } catch (error: any) {

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar el registro.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
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
      cancelButtonText: "Cancelar",
    });

    if (!confirmar.isConfirmed) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras/${id}`,
        authHeader(token)
      );

      await Swal.fire({
        icon: "success",
        title: "Registro eliminado",
        text: "El registro fue eliminado correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });


      // ACTUALIZAR INFORMACIÓN

    await cargarImpresoras(token, busqueda);
    await cargarStats();
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el registro.",
      confirmButtonColor: "#8A2036",
      confirmButtonText: "Aceptar",
    });
  }
};


// CARGAR ADMINISTRADORES
// OBTIENE LA LISTA DE ADMINISTRADORES DESDE LA API

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


// CARGA ADMINISTRADORES Y ABRE EL MODAL 

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
      confirmButtonText: "Aceptar",
    });
  }
};


// ABRIR FORMULARIO PARA NUEVO ADMINISTRADOR
  
const abrirNuevoAdmin = () => {
  setMostrarContrasenasAdmin(false);
  setMostrarAdministradoresRegistrados(false);
  setEditandoAdminId(null);
  
  setFormAdmin({
    nombre: "",
    usuario: "",
    password: "",
    repetirPassword: "",
    passwordActual: ""
  });

  setMostrarAdmins(true);
};


// ABRIR FORMULARIO PARA EDITAR ADMINISTRADOR
 
const abrirEditarAdmin = (admin: UsuarioAdmin) => {
  setMostrarContrasenasAdmin(false);
  setMostrarAdministradoresRegistrados(false);
  setEditandoAdminId(admin._id || null);

  setFormAdmin({
    nombre: admin.nombre,
    usuario: admin.usuario,
    password: "",
    repetirPassword: "",
    passwordActual: ""
  });

  setMostrarAdmins(true);
};


// ACTUALIZAR CAMPOS DEL FORMULARIO DE ADMINISTRADORES

const handleAdminChange = (
    e: React.ChangeEvent<HTMLInputElement>
) => {
  setFormAdmin({
    ...formAdmin,
    [e.target.name]: e.target.value,
  });
};


// VALIDAR CONTRASEÑA: MÍNIMO 8 CARACTERES, UNA MAYÚSCULA, UNA MINÚSCULA Y UN SÍMBOLO
 
const passwordValida = (pass: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

  return regex.test(pass);
};


// VALIDACIONES VISUALES DE CONTRASEÑA: INDICADORES DE CUMPLIMIENTO EN EL FORMULARIO 

const passwordActualTexto = formAdmin.password;

  const cumpleLongitud = passwordActualTexto.length >= 8;
  const cumpleMayuscula = /[A-Z]/.test(passwordActualTexto);
  const cumpleMinuscula = /[a-z]/.test(passwordActualTexto);
  const cumpleSimbolo = /[^A-Za-z0-9]/.test(passwordActualTexto);
  const cumpleRepeticion =
    formAdmin.repetirPassword.length > 0 &&
    formAdmin.password === formAdmin.repetirPassword;


// GUARDAR ADMINISTRADOR: CREA O ACTUALIZA UN REGISTRO 

const guardarAdmin = async () => {
  try {
    if (
      formAdmin.password !==
      formAdmin.repetirPassword
    ) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });

        return;
    }


// VALIDAR REQUISITOS DE SEGURIDAD

if (!passwordValida(formAdmin.password)) {
  await Swal.fire({
    icon: "error",
    title: "Contraseña inválida",
    text: "Debe contener mayúscula, minúscula, símbolo y mínimo 8 caracteres.",
    confirmButtonColor: "#8A2036",
    confirmButtonText: "Aceptar",
  });

  return;
}


// ACTUALIZAR ADMINISTRADOR

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
    confirmButtonText: "Aceptar",
  });

  } else {


// CREAR ADMINISTRADOR

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
    confirmButtonText: "Aceptar",
  });

  }

  // LIMPIAR FORMULARIO

  setEditandoAdminId(null);
  setFormAdmin({
    nombre: "",
    usuario: "",
    password: "",
    repetirPassword: "",
    passwordActual: ""

  });

  // ACTUALIZAR LISTAS 

  await cargarAdministradores(token);
  await cargarAdministradoresRegistrados(token);


  // MOSTRAR NUEVAMENTE LA LISTA 

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
        confirmButtonText: "Aceptar",
      });

    }
};


// ELIMINAR ADMINISTRADOR: CONFIRMA Y ACTUALIZA LISTA
 
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
    cancelButtonText: "Cancelar",
 });

  if (!confirmar.isConfirmed) return;
  
    try {
      await axios.delete(
       `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
        authHeader(token)
      );

      // ACTUALIZAR LISTAS DE ADMINISTRADORES

      setAdministradores((prev) =>
        prev.filter((admin) => admin._id !== id)
      );

      setAdministradoresRegistrados((prev) =>
        prev.filter((admin) => admin._id !== id)
      );

      await Swal.fire({
        icon: "success",
        title: "Administrador eliminado",
        text: "El administrador fue eliminado correctamente.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });

      // RECARGAR INFORMACIÓN DESDE EL SERVIDOR

      await cargarAdministradores(token);
      await cargarAdministradoresRegistrados(token);

    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "No se pudo eliminar el administrador.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });
    }
 };


// CERRAR FORMULARIO DE ADMINISTRADOR: OCULTA EL FORMULARIO Y REINICIA ESTADOS

 const cerrarFormularioAdmin = () => {
    setMostrarAdmins(false);
    setEditandoAdminId(null);
    setMostrarAdministradoresRegistrados(false);
    setMostrarContrasenasAdmin(false);
  };

  const cancelarFormularioAdmin = () => {
    setMostrarAdmins(false);
    setEditandoAdminId(null);
    setMostrarAdministradoresRegistrados(true);
    setMostrarContrasenasAdmin(false);
 };


// CERRAR SESIÓN, ELIMINA LA SESIÓN Y REINICIA ESTADOS DE LA APP

  const cerrarSesion = async () => {
  
    /* Eliminar datos almacenados */
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");

      /* Reiniciar datos del usuario */
      setUsuario("");
      setPassword("");
      setToken("");
      setRol("");
      setNombreUsuario("");
      setLogueado(false);

      /* Reiniciar filtros */
      setBusqueda("");
      setFiltroEdificio("");

      /* Limpiar información cargada */
      setImpresoras([]);
      setCoincidencias(0);
      setTotalRegistros(0);
      setAdministradores([]);
      setAdministradoresRegistrados([]);

      /* Cerrar todos los formularios */
      setMostrarFormulario(false);
      setMostrarAdmins(false);
      setMostrarAdministradoresRegistrados(false);
      setMostrarContrasenasAdmin(false);
      setMostrarLogin(false);
      setMostrarMenuUsuario(false);

      /* Restablecer formularios */
      setEditandoId(null);
      setEditandoAdminId(null);
      setForm(vacioImpresora);
      
      setFormAdmin({
        nombre: "",
        usuario: "",
        password: "",
        repetirPassword: "",
        passwordActual: ""

      });

      /* Cargar nuevamente los registros públicos */
      await cargarImpresoras("", "");
};


// ABRIR ADMINISTRADORES REGISTRADOS

const abrirAdministradoresRegistrados = () => {
    cargarAdministradoresRegistrados(token);
};


// INTERFAZ PRINCIPAL

return (
  <>
 {/* ENCABEZADO: LOGOTIPOS, ACCESO Y MENÚ DE USUARIO */}

<Header
      logueado={logueado}
      usuario={usuario}
      password={password}
      nombreUsuario={nombreUsuario}
      rol={rol}
      mostrarMenuUsuario={mostrarMenuUsuario}
      setMostrarMenuUsuario={setMostrarMenuUsuario}
      mostrarLogin={mostrarLogin}
      setMostrarLogin={setMostrarLogin}
      setUsuario={setUsuario}
      setPassword={setPassword}
      login={login}
      abrirAdministradoresRegistrados={
      abrirAdministradoresRegistrados}
      cerrarSesion={cerrarSesion}
        
    />


{/* CONTENIDO PRINCIPAL */}

<div className="panel">
{/* Barra de búsqueda y filtros */}
  <SearchBar
    logueado={logueado}
    token={token}
    busqueda={busqueda}
    setBusqueda={setBusqueda}
    filtroEdificio={filtroEdificio}
    setFiltroEdificio={setFiltroEdificio}
    edificios={edificios}
    abrirNuevo={abrirNuevo}
    stats={stats}
    departamentos={departamentos}
    ubicaciones={ubicaciones}
    equipos={equipos}
    filtroDepartamento={filtroDepartamento}
    setFiltroDepartamento={setFiltroDepartamento}
    filtroUbicacion={filtroUbicacion}
    setFiltroUbicacion={setFiltroUbicacion}
    filtroEquipo={filtroEquipo}
    setFiltroEquipo={setFiltroEquipo}
    exportarExcel={descargarExcel}
    exportarPDF={generarPDF}
  />


{/* Tabla de registros */}

<EquipmentTable
  impresoras={impresoras}
  impresorasPaginadas={impresorasPaginadas}
  logueado={logueado}
  abrirEditar={abrirEditar}
  eliminar={eliminar}
  ordenarPor={ordenarPor}
  ordenCampo={ordenCampo}
  ordenDireccion={ordenDireccion}
/>

{/* Controles de paginación */}

<Pagination
  impresoras={impresoras}
  indiceInicio={indiceInicio}
  indiceFin={indiceFin}
  paginaActual={paginaActual}
  totalPaginas={totalPaginas}
  setPaginaActual={setPaginaActual}
  registrosPorPagina={registrosPorPagina}
  setRegistrosPorPagina={setRegistrosPorPagina}
/>
</div>


{/* MODALES */}

{/* Modal para agregar o editar registros */}

<EquipmentModal
  mostrarFormulario={mostrarFormulario}
  editandoId={editandoId}
  form={form}
  handleChange={handleChange}
  guardar={guardar}
  setMostrarFormulario={setMostrarFormulario}
  setEditandoId={setEditandoId}
/>

{/* Modal para crear o editar administradores */}

<AdminModal
  rol={rol}
  mostrar={mostrarAdmins}
  editandoAdminId={editandoAdminId}
  formAdmin={formAdmin}
  mostrarContrasenasAdmin={mostrarContrasenasAdmin}
  setMostrarContrasenasAdmin={setMostrarContrasenasAdmin}
  cumpleLongitud={cumpleLongitud}
  cumpleMayuscula={cumpleMayuscula}
  cumpleMinuscula={cumpleMinuscula}
  cumpleSimbolo={cumpleSimbolo}
  cumpleRepeticion={cumpleRepeticion}
  adminInputRefs={adminInputRefs}
  guardarAdmin={guardarAdmin}
  cerrarFormularioAdmin={cerrarFormularioAdmin}
  handleAdminChange={handleAdminChange}
  moverAdminConEnter={moverAdminConEnter}
  cancelarFormularioAdmin={cancelarFormularioAdmin}
/>


{/* Modal con la lista de administradores */}

<AdminListModal
  rol={rol}
  mostrar={mostrarAdministradoresRegistrados}
  administradoresRegistrados={administradoresRegistrados}
  setMostrar={setMostrarAdministradoresRegistrados}
  abrirEditarAdmin={abrirEditarAdmin}
  eliminarAdmin={eliminarAdmin}
  abrirNuevoAdmin={abrirNuevoAdmin}

/>
</>
);
}