//  TIPOS DEL SISTEMA: IMPRESORAS, ADMINISTRADORES Y FORMULARIOS 

// MODELO DE IMPRESORA / EQUIPO

export interface Impresora {
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
}


// MODELO DE USUARIO ADMINISTRADOR

export interface UsuarioAdmin {
    _id?: string;
    nombre: string;
    usuario: string;
    rol: string;
}


// FORMULARIO DE ADMINISTRADOR

export interface FormAdmin {
    nombre: string;
    usuario: string;
    password: string;
    repetirPassword: string;
    passwordActual: string;
}