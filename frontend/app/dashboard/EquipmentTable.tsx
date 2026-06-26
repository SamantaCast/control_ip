/* TABLA DE REGISTROS DE EQUIPOS MUESTRA, ORDENA Y GESTIONA REGISTROS */

"use client";


// IMPORTACIONES

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faArrowUp,
  faArrowDown,
  faArrowsUpDown,
} from "@fortawesome/free-solid-svg-icons";
import type { Impresora } from "./types";


// PROPIEDADES DEL COMPONENTE

interface Props {
  impresoras: Impresora[];
  impresorasPaginadas: Impresora[];
  logueado: boolean;
  abrirEditar:(imp:Impresora)=>void;
  eliminar:(id?:string)=>void;
  ordenarPor:(campo:string)=>void;
  ordenCampo:string;
  ordenDireccion:"asc" | "desc";
}


// COMPONENTE

export default function EquipmentTable({
  impresoras,
  impresorasPaginadas,
  logueado,
  abrirEditar,
  eliminar,
  ordenarPor,
  ordenCampo,
  ordenDireccion,
}: Props) {


// ICONO DE ORDEN

const iconoOrden = (campo: string) => {
  if (ordenCampo !== campo) {
    return faArrowsUpDown;
  }
    return ordenDireccion === "asc"
        ? faArrowUp
        : faArrowDown;
};
  
  return (


// TABLA DE REGISTROS
  
<div className="tableBox">
  <table className="dataTable">


{/* ENCABEZADO DE LA TABLA */}

  <thead>
    <tr>


{/* DEPARTAMENTO */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("departamento")}
  >
    Departamento

      <FontAwesomeIcon
            icon={iconoOrden("departamento")}
            className="sortIcon"
      />
  </th>


{/* EDIFICIO */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("edificio")}
  >
    Edificio

      <FontAwesomeIcon
        icon={iconoOrden("edificio")}
        className="sortIcon"
      />
  </th>


{/* UBICACIÓN */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("ubicacion")}
    >
      Ubicación

        <FontAwesomeIcon
          icon={iconoOrden("ubicacion")}
          className="sortIcon"
        />
</th>


{/* NOMBRE */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("nombre")}
    >
      Nombre

      <FontAwesomeIcon
        icon={iconoOrden("nombre")}
        className="sortIcon"
      />
  </th>


{/* EMAIL */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("email")}
    >
      Email
      
      <FontAwesomeIcon
        icon={iconoOrden("email")}
        className="sortIcon"
      />
  </th>


{/* EQUIPO */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("equipo")}
    >
      Equipo

      <FontAwesomeIcon
        icon={iconoOrden("equipo")}
        className="sortIcon"
        />
  </th>


{/* USUARIO */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("usuario")}
    >
      Usuario

      <FontAwesomeIcon icon={iconoOrden("usuario")} className="sortIcon"/>
  </th>


{/* IP */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("ip")}
    >

      IP

      <FontAwesomeIcon 
        icon={iconoOrden("ip")} 
        className="sortIcon"/>
  </th>


{/* CÓDIGO */}

  <th
    className="tableHeadCell sortable"
    onClick={() => ordenarPor("codigo")}
  >
    Código

    <FontAwesomeIcon 
      icon={iconoOrden("codigo")} 
      className="sortIcon"/>
</th>

  {logueado && (
    <th className="tableHeadCell">
        Acciones
      </th>
    )}
</tr>

</thead>


{/* CUERPO DE LA TABLA */}

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


    /* REGISTROS */

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


{/* BOTONES DE ACCIÓN */}

  {logueado && (
    <td className="tableCell">
      <div className="actionBtns">

                     
{/* EDITAR */}

  <button
    className="iconBtn editBtn"
    onClick={() => abrirEditar(imp)}
  >
    <FontAwesomeIcon 
     icon={faPenToSquare} 
    />
  </button>


{/* ELIMINAR */}

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