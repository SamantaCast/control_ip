/* ===========================================
   TIPOS DEL PROYECTO
=========================================== */

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

export interface UsuarioAdmin {

    _id?: string;

    nombre: string;

    usuario: string;

    rol: string;

}

export interface FormAdmin {

    nombre: string;

    usuario: string;

    password: string;

    repetirPassword: string;

    passwordActual: string;

}