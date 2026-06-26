// EXPORTAR REPORTE EXCEL Control Equipos de Cómputo

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { Impresora } from "../dashboard/types";


// CARGAR IMAGEN

async function cargarImagen(url: string): Promise<ArrayBuffer> {
    const respuesta = await fetch(url);
    return await respuesta.arrayBuffer();
}


// EXPORTAR EXCEL

export async function exportarExcel(
    impresoras: Impresora[]) {

    /*  FECHA */
    const fecha = new Date();

    /* LIBRO */
    const libro = new ExcelJS.Workbook();
    libro.creator = "Departamento de Informática";
    libro.company = "LICONSA";
    libro.subject = "Control Equipos de Cómputo";
    libro.title = "Control Equipos de Cómputo";
    libro.created = fecha;

    /* HOJA */
    const hoja = libro.addWorksheet("GENERAL");

    /* CONFIGURAR PÁGINA */
    hoja.pageSetup = {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
            left: 0.25,
            right: 0.25,
            top: 0.35,
            bottom: 0.35,
            header: 0.15,
            footer: 0.15
        }
    };

    /* CARGAR LOGOS */

    const logo1 = await cargarImagen("/logos/1.png");
    const logo2 = await cargarImagen("/logos/2.png");
    const logo3 = await cargarImagen("/logos/3.png");

    /* AGREGAR LOGOS */

    const idLogo1 = libro.addImage({
        buffer: logo1,
        extension: "png"
    });

    const idLogo2 = libro.addImage({
        buffer: logo2,
        extension: "png"
    });

    const idLogo3 = libro.addImage({
        buffer: logo3,
        extension: "png"
    });
       
    
// INSERTAR LOGOS

hoja.addImage(idLogo1,{
    tl:{col:0.10,row:0.10},
    ext:{
        width:205,
        height:60
    }
});

hoja.addImage(idLogo2,{
    tl:{col:1.10,row:0.10},
    ext:{
        width:180,
        height:60
    }
});

hoja.addImage(idLogo3,{
    tl:{col:3.15,row:0.05},
    ext:{
        width:95,
        height:60
    }
});


/* COMBINAR CELDAS */

hoja.mergeCells("A5:I5");
hoja.mergeCells("A6:I6");
    

// TÍTULO
   
hoja.getRow(5).height = 28;
hoja.getRow(6).height = 22;

    hoja.getCell("A5").value =
        "CONTROL EQUIPOS DE CÓMPUTO";
    hoja.getCell("A5").font = {
        bold: true,
        size: 20,
        color: {
            argb: "8A2036"
        }
    };

    hoja.getCell("A5").alignment = {
        horizontal: "center",
        vertical: "middle"
    };


// SUBTÍTULO

hoja.getCell("A6").value =
"Sistema de Gestión de Activos Informáticos";

hoja.getCell("A6").font = {
    size:12,
    color:{
        argb:"666666"
    }
};

hoja.getCell("A6").alignment={
    horizontal:"center",
    vertical:"middle"
};


// TOTAL DE REGISTROS

hoja.getCell("H7").value = "TOTAL:";
hoja.getCell("I7").value =impresoras.length;

    ["H7"].forEach(celda=>{
    hoja.getCell(celda).font={
        bold:true,
        size:10,
        color:{
            argb:"8A2036"
        }
    };
});


// LÍNEA SEPARADORA
   
for(let c=1;c<=9;c++){
    hoja.getRow(8).getCell(c).border={
        bottom:{
          style:"medium",
          color:{
            argb:"8A2036"
            }
        }
    };
}


// ENCABEZADOS DE LA TABLA
 
const encabezados = [
    "DEPARTAMENTO",
    "EDIFICIO",
    "UBICACIÓN",
    "NOMBRE",
    "EMAIL",
    "EQUIPO",
    "USUARIO",
    "IP",
    "CÓDIGO"
];

const filaEncabezado = hoja.getRow(9);
    encabezados.forEach((titulo, index) => {
        const celda = filaEncabezado.getCell(index + 1);
        celda.value = titulo;
        celda.font = {
            bold: true,
            color: {
                argb: "FFFFFF"
            }
        };

        celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "8A2036"
            }
        };

        celda.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        celda.border = {
            top: {
                style: "thin"
            },

            bottom: {
                style: "thin"
            },
            left: {
                style: "thin"
            },
            right: {
                style: "thin"
            }
        };
    });

    filaEncabezado.height = 24;


// AGREGAR REGISTROS
 
 impresoras.forEach((imp, indice) => {
    const fila = hoja.addRow([
        imp.departamento,
        imp.edificio,
        imp.ubicacion,
        imp.nombre,
        imp.email,
        imp.equipo,
        imp.usuario,
        imp.ip,
        imp.codigo
    ]);

    fila.height = 21;
    fila.eachCell((celda) => {
        celda.alignment = {
        vertical: "middle"
        };

        celda.border = {
            top: {
                style: "thin",
                color: {
                    argb: "D9D9D9"
                }
            },

        bottom: {
            style: "thin",
                color: {
                    argb: "D9D9D9"
                }
        },

        left: {
            style: "thin",
                color: {
                    argb: "D9D9D9"
                }
        },

        right: {
            style: "thin",
                color: {
                    argb: "D9D9D9"
                }
        }
    };

});


/* Filas alternadas */

if (indice % 2 === 0) {
    fila.eachCell((celda) => {
        celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "F7F7F7"
            }
        };
    });
}

});


// FILTROS
   
hoja.autoFilter = {
    from:{
        row:9,
        column:1
    },
    to:{
        row:9,
        column:9
    }
};


// ANCHO DE COLUMNAS
  
hoja.columns = [
    { width: 34 },
    { width: 10 },
    { width: 18 },
    { width: 34 },
    { width: 36 },
    { width: 15 },
    { width: 18 },
    { width: 18 },
    { width: 12 }
];


// CONFIGURAR IMPRESIÓN
    
hoja.pageSetup.printTitlesRow = "10:10";
hoja.pageSetup.horizontalCentered = true;
hoja.pageSetup.verticalCentered = false;

hoja.headerFooter.oddFooter =
    "&LDepartamento de Informática&CControl Equipos de Cómputo&RPágina &P de &N";

hoja.headerFooter.evenFooter =
    "&LDepartamento de Informática&CControl Equipos de Cómputo&RPágina &P de &N";


// GENERAR ARCHIVO
   
const buffer = await libro.xlsx.writeBuffer();

const archivo = new Blob(
    [buffer],
    {
        type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
);


// NOMBRE DEL ARCHIVO

const nombreArchivo =
    `Control_Equipos_${fecha
        .toLocaleDateString("es-MX")
        .replace(/\//g,"-")}.xlsx`;
saveAs(
    archivo,
    nombreArchivo
);
}