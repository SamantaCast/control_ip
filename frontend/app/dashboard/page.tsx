"use client";

/* ==========================================================
   IMPORTACIONES
========================================================== */

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

/* ==========================================================
   CONSTANTES
========================================================== */
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

/* ==========================================================
   COMPONENTE PRINCIPAL
========================================================== */

export default function Page() {
  /* ======================================================
     ESTADOS DEL LOGIN
  ====================================================== */

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const [logueado, setLogueado] = useState(false);
  const [rol, setRol] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");

  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  /* ======================================================
     CONTADORES
  ====================================================== */

  const [totalRegistros, setTotalRegistros] = useState(0);
  const [coincidencias, setCoincidencias] = useState(0);

  /* ======================================================
     BUSCADOR
  ====================================================== */

  const [busqueda, setBusqueda] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState("");
  const [edificios, setEdificios] = useState<string[]>([]);

  /* ======================================================
     IMPRESORAS
  ====================================================== */

  const [impresoras, setImpresoras] = useState<Impresora[]>([]);

  /* ======================================================
     FORMULARIO DE IMPRESORAS
  ====================================================== */

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [form, setForm] =
    useState<Impresora>(vacioImpresora);

  /* ======================================================
     ADMINISTRADORES
  ====================================================== */

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

  /* ======================================================
     REFERENCIAS
     Permiten mover el foco con ENTER entre los inputs
     del formulario de administradores.
  ====================================================== */

  const adminInputRefs =
    useRef<(HTMLInputElement | null)[]>([]);

  /* ======================================================
     PAGINACIÓN
  ====================================================== */

  const [paginaActual, setPaginaActual] = useState(1);

  const registrosPorPagina = 15;

  const totalPaginas = Math.ceil(
    impresoras.length / registrosPorPagina
  );

  const indiceInicio =
    (paginaActual - 1) * registrosPorPagina;

  const indiceFin =
    indiceInicio + registrosPorPagina;

  const impresorasPaginadas =
    impresoras.slice(indiceInicio, indiceFin);

  /* ======================================================
     FORMULARIO DE ADMINISTRADORES
  ====================================================== */

  const [formAdmin, setFormAdmin] =
  useState<FormAdmin>({
    usuario: "",
    passwordActual: "",
    password: "",
    repetirPassword: "",
    rol: "admin",
  });

  /* ======================================================
     NAVEGACIÓN ENTRE INPUTS DEL FORMULARIO ADMIN
  ====================================================== */

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

  /* ======================================================
     CARGA INICIAL
     - Recupera la sesión almacenada.
     - Carga los registros.
     - Si es administrador, carga la lista de usuarios.
  ====================================================== */

  useEffect(() => {
    const tokenGuardado =
      localStorage.getItem("token");

    const rolGuardado =
      localStorage.getItem("rol");

    const nombreGuardado =
      localStorage.getItem("nombre");

    cargarImpresoras("", "");
    cargarEdificios();

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

}, [busqueda, filtroEdificio]);

  /* ======================================================
     CABECERA DE AUTORIZACIÓN
     Se utiliza para todas las peticiones protegidas.
  ====================================================== */

  const authHeader = (tok: string) => ({
    headers: {
      Authorization: `Bearer ${tok}`,
    },
  });

  /* ===========================================
   CARGAR EDIFICIOS
=========================================== */
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

  /* ======================================================
     INICIAR SESIÓN
  ====================================================== */

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
           /* ===========================================
         Login exitoso
      =========================================== */

      console.log("LOGIN:", res.data);

      // Guardar datos de la sesión en el navegador
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("rol", res.data.rol);
      localStorage.setItem("nombre", res.data.nombre);

      // Actualizar estados de la aplicación
      setToken(res.data.token);
      setRol(res.data.rol);
      setNombreUsuario(res.data.nombre);
      setLogueado(true);

      // Cerrar el formulario de inicio de sesión
      setMostrarLogin(false);

      // Cargar los registros disponibles
      cargarImpresoras("", "");
      cargarEdificios();

      // Si el usuario es administrador, cargar la lista de administradores
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

  /* ===========================================
     CARGAR REGISTROS DE IMPRESORAS
  =========================================== */

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

      // Actualizar la tabla
      setImpresoras(res.data);

      // Guardar el número de coincidencias encontradas
      setCoincidencias(res.data.length);

      // Actualizar el total únicamente cuando no existe búsqueda
      if (textoBusqueda === "") {
        setTotalRegistros(res.data.length);
      }

    } catch (error) {
      console.log("Error al cargar impresoras:", error);
    }
  };

  /* ===========================================
     BUSCAR REGISTROS
  =========================================== */

  const buscar = async () => {
    try {
      const texto = busqueda.trim();
      const edificio = filtroEdificio.trim();

      const config = token ? authHeader(token) : {};

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/impresoras?busqueda=${encodeURIComponent(
          texto
        )}&edificio=${encodeURIComponent(edificio)}`,
        config
      );

      // Actualizar resultados
      setImpresoras(res.data);

      // Regresar a la primera página
      setPaginaActual(1);

      // Actualizar contador de coincidencias
      setCoincidencias(res.data.length);


    } catch (error) {
      console.log(error);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al buscar.",
        confirmButtonColor: "#8A2036",
        confirmButtonText: "Aceptar",
      });
    }
  };

  /* ===========================================
     ABRIR FORMULARIO PARA NUEVO REGISTRO
  =========================================== */

  const abrirNuevo = () => {
    setEditandoId(null);
    setForm(vacioImpresora);
    setMostrarFormulario(true);
  };

  /* ===========================================
     ABRIR FORMULARIO PARA EDITAR REGISTRO
  =========================================== */

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

  /* ===========================================
     ACTUALIZAR CAMPOS DEL FORMULARIO
  =========================================== */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================================
     GUARDAR O ACTUALIZAR REGISTRO
  =========================================== */

  const guardar = async () => {

    // Validar campos obligatorios
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

      // Actualizar registro existente
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

        // Crear un nuevo registro
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

      // Restablecer el formulario
      setMostrarFormulario(false);
      setEditandoId(null);
      setForm(vacioImpresora);

      // Recargar la información
      await cargarImpresoras(token, busqueda);

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

  /* ===========================================
     ELIMINAR REGISTRO
  =========================================== */

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

      // Actualizar información
      await cargarImpresoras(token, busqueda);

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
    /* ===========================================
     CARGAR ADMINISTRADORES
     Obtiene la lista de administradores desde
     la API para mantenerla actualizada.
  =========================================== */

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

  /* ===========================================
     CARGAR ADMINISTRADORES REGISTRADOS
     Obtiene la lista y abre el modal donde
     se muestran los administradores.
  =========================================== */

  const cargarAdministradoresRegistrados = async (
    tok: string
  ) => {
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

  /* ===========================================
     ABRIR FORMULARIO PARA NUEVO ADMINISTRADOR
  =========================================== */

  const abrirNuevoAdmin = () => {
    setMostrarContrasenasAdmin(false);
    setMostrarAdministradoresRegistrados(false);
    setEditandoAdminId(null);

    setFormAdmin({
      usuario: "",
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: "admin",
    });

    setMostrarAdmins(true);
  };

  /* ===========================================
     ABRIR FORMULARIO PARA EDITAR ADMINISTRADOR
  =========================================== */

  const abrirEditarAdmin = (admin: UsuarioAdmin) => {
    setMostrarContrasenasAdmin(false);
    setMostrarAdministradoresRegistrados(false);

    setEditandoAdminId(admin._id || null);

    setFormAdmin({
      usuario: admin.usuario,
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: admin.rol,
    });

    setMostrarAdmins(true);
  };

  /* ===========================================
     ACTUALIZAR CAMPOS DEL FORMULARIO
     DE ADMINISTRADORES
  =========================================== */

  const handleAdminChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormAdmin({
      ...formAdmin,
      [e.target.name]: e.target.value,
    });
  };

  /* ===========================================
     VALIDAR CONTRASEÑA
     Debe contener:
     - Mínimo 8 caracteres
     - Una mayúscula
     - Una minúscula
     - Un símbolo
  =========================================== */

  const passwordValida = (pass: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    return regex.test(pass);
  };

  /* ===========================================
     VALIDACIONES VISUALES DE LA CONTRASEÑA
     Se utilizan para mostrar los indicadores
     de cumplimiento en el formulario.
  =========================================== */

  const passwordActualTexto = formAdmin.password;

  const cumpleLongitud =
    passwordActualTexto.length >= 8;

  const cumpleMayuscula =
    /[A-Z]/.test(passwordActualTexto);

  const cumpleMinuscula =
    /[a-z]/.test(passwordActualTexto);

  const cumpleSimbolo =
    /[^A-Za-z0-9]/.test(passwordActualTexto);

  const cumpleRepeticion =
    formAdmin.repetirPassword.length > 0 &&
    formAdmin.password === formAdmin.repetirPassword;

  /* ===========================================
     GUARDAR ADMINISTRADOR
     Crea un nuevo administrador o actualiza
     uno existente.
  =========================================== */

  const guardarAdmin = async () => {
    try {

      /* Validar que ambas contraseñas coincidan */

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

      /* Validar requisitos de seguridad */

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

      /* Actualizar administrador */

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

        /* Crear administrador */

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

      /* Limpiar formulario */

      setEditandoAdminId(null);

      setFormAdmin({
        usuario: "",
        passwordActual: "",
        password: "",
        repetirPassword: "",
        rol: "admin",
      });

      /* Actualizar listas */

      await cargarAdministradores(token);
      await cargarAdministradoresRegistrados(token);

      /* Mostrar nuevamente la lista */

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
  /* ===========================================
     ELIMINAR ADMINISTRADOR
     Solicita confirmación antes de eliminar un
     administrador y actualiza la lista.
  =========================================== */

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

      // Actualizar las listas de administradores
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

      // Recargar información desde el servidor
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

  /* ===========================================
     CERRAR FORMULARIO DE ADMINISTRADOR
     Oculta el formulario y vuelve a mostrar
     la lista de administradores.
  =========================================== */

  const cerrarFormularioAdmin = () => {
    setMostrarAdmins(false);
    setEditandoAdminId(null);
    setMostrarAdministradoresRegistrados(true);
    setMostrarContrasenasAdmin(false);
  };

  /* ===========================================
     CERRAR SESIÓN
     Elimina la sesión actual y restablece
     todos los estados de la aplicación.
  =========================================== */

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
      usuario: "",
      passwordActual: "",
      password: "",
      repetirPassword: "",
      rol: "admin",
    });

    /* Cargar nuevamente los registros públicos */

    await cargarImpresoras("", "");
  };

  /* ===========================================
     INTERFAZ PRINCIPAL
  =========================================== */

  return (
    <>
      {/* =======================================
          ENCABEZADO
          Contiene los logotipos, el acceso al
          sistema y el menú del usuario.
      ======================================== */}

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
        abrirNuevoAdmin={abrirNuevoAdmin}
        cerrarSesion={cerrarSesion}
      />

      {/* =======================================
          CONTENIDO PRINCIPAL
      ======================================== */}

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

    buscar={buscar}

    cargarImpresoras={cargarImpresoras}

    abrirNuevo={abrirNuevo}

/>

        {/* Tabla de registros */}

        <EquipmentTable
          impresoras={impresoras}
          impresorasPaginadas={impresorasPaginadas}
          logueado={logueado}
          abrirEditar={abrirEditar}
          eliminar={eliminar}
        />

        {/* Controles de paginación */}

        <Pagination
          impresoras={impresoras}
          indiceInicio={indiceInicio}
          indiceFin={indiceFin}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          setPaginaActual={setPaginaActual}
        />
      </div>

      {/* =======================================
          MODALES
      ======================================== */}

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