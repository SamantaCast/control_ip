/* ==================================================
   EXPORTAR A EXCEL
================================================== */

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import type { Impresora } from "../dashboard/types";

/* ==================================================
   EXPORTAR REGISTROS
================================================== */

export function exportarExcel(
    impresoras: Impresora[]
) {

    const datos = impresoras.map((imp) => ({

        Departamento: imp.departamento,

        Edificio: imp.edificio,

        Ubicación: imp.ubicacion,

        Nombre: imp.nombre,

        Email: imp.email,

        Equipo: imp.equipo,

        Usuario: imp.usuario,

        IP: imp.ip,

        Código: imp.codigo,

    }));

    const hoja = XLSX.utils.json_to_sheet(datos);

    const libro = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Equipos"
    );

    const excel =
        XLSX.write(libro, {
            bookType: "xlsx",
            type: "array",
        });

    const archivo = new Blob(
        [excel],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
    );

    saveAs(
        archivo,
        `Equipos_${new Date()
            .toLocaleDateString("es-MX")
            .replace(/\//g, "-")}.xlsx`
    );

}