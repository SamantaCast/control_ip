/* ==================================================
   EXPORTAR REPORTE PDF
   Control Equipos de Cómputo
================================================== */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import type { Impresora } from "../dashboard/types";

/* ==================================================
   CONVERTIR IMAGEN A BASE64
================================================== */

async function cargarImagen(
    url: string
): Promise<string> {

    return new Promise((resolve, reject) => {

        const img = new Image();

        img.crossOrigin = "anonymous";

        img.src = url;

        img.onload = () => {

            const canvas =
                document.createElement("canvas");

            canvas.width = img.width;

            canvas.height = img.height;

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {

                reject(
                    "No fue posible crear el Canvas."
                );

                return;

            }

            ctx.drawImage(img, 0, 0);

            resolve(
                canvas.toDataURL("image/png")
            );

        };

        img.onerror = () => {

            reject(
                `No fue posible cargar ${url}`
            );

        };

    });

}

/* ==================================================
   EXPORTAR PDF
================================================== */

export async function exportarPDF(
    impresoras: Impresora[]
) {

    /* ==========================================
       CREAR DOCUMENTO
    ========================================== */

    const doc = new jsPDF({

        orientation: "landscape",

        unit: "mm",

        format: "a4",

    });

    /* ==========================================
       CARGAR LOGOS
    ========================================== */

    const logo1 =
        await cargarImagen("/logos/1.png");

    const logo2 =
        await cargarImagen("/logos/2.png");

    const logo3 =
        await cargarImagen("/logos/3.png");

    /* ==========================================
       FECHA ACTUAL
    ========================================== */

    const fecha = new Date();

    /* ==========================================
       TABLA
    ========================================== */

    autoTable(doc,{

        startY:59,

        theme:"grid",

        margin:{
    top:12,
    left:10,
    right:10,
    bottom:20
},

        head:[[

            "Departamento",

            "Edificio",

            "Ubicación",

            "Nombre",

            "Email",

            "Equipo",

            "Usuario",

            "IP",

            "Código"

        ]],

        body: impresoras.map((imp)=>[

            imp.departamento,

            imp.edificio,

            imp.ubicacion,

            imp.nombre,

            imp.email,

            imp.equipo,

            imp.usuario,

            imp.ip,

            imp.codigo

        ]),

        headStyles:{

            fillColor:[138,32,54],

            textColor:[255,255,255],

            halign:"center",

            fontStyle:"bold"

        },

        styles:{

            fontSize:7,

            cellPadding:1.6,

            overflow:"linebreak"

        },

        alternateRowStyles:{

            fillColor:[248,248,248]

        },
        /* ==========================================
   ENCABEZADO
   (Sólo en la primera página)
========================================== */

willDrawPage:(data)=>{

    if(data.pageNumber!==1)return;

    /* ======================================
       LOGOS
    ====================================== */

   doc.addImage(
    logo1,
    "PNG",
    10,
    10,
    43,
    13
);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(18);

    doc.setTextColor(170);

    doc.text("|",55,18);

    doc.addImage(
        logo2,
        "PNG",
        59,
10,
39,
13
    );

    doc.addImage(
        logo3,
        "PNG",
       101,
9,
26,
13
    );

    /* ======================================
       TÍTULO
    ====================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(22);

    doc.setTextColor(
        138,
        32,
        54
    );

    doc.text(
        "Control Equipos de Cómputo",
        165,
        35,
        {
            align:"center"
        }
    );

    /* ======================================
       SUBTÍTULO
    ====================================== */

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(11);

    doc.setTextColor(90);

    doc.text(
        "Sistema de Gestión de Activos Informáticos",
        165,
        43,
        {
            align:"center"
        }
    );

    /* ======================================
       FECHA / HORA / TOTAL
    ====================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(10);

    doc.setTextColor(
        138,
        32,
        54
    );

    doc.text(
        "FECHA:",
        168,
        52
    );

    doc.text(
        "HORA:",
        215,
        52
    );

    doc.text(
        "TOTAL:",
        258,
        52
    );

    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setTextColor(70);

    doc.text(
        fecha.toLocaleDateString("es-MX"),
        184,
        52
    );

    doc.text(
        fecha.toLocaleTimeString("es-MX"),
        228,
        52
    );

    doc.text(
        `${impresoras.length}`,
        287,
        52,
        {
            align:"right"
        }
    );


},
    });

/* ==========================================
   AGREGAR PIE DE PÁGINA
========================================== */

const paginas = doc.getNumberOfPages();

for (let pagina = 1; pagina <= paginas; pagina++) {

    doc.setPage(pagina);

    doc.setDrawColor(220);
    doc.setLineWidth(.3);

    doc.line(
        10,
        196,
        287,
        196
    );

    doc.setFont("helvetica","normal");
    doc.setFontSize(9);
    doc.setTextColor(90);

    doc.text(
        "Documento generado automáticamente por el Sistema Control Equipos de Cómputo | Departamento de Informática",
        10,
        201
    );

    doc.text(
        `Página ${pagina} de ${paginas}`,
        287,
        201,
        {
            align: "right"
        }
    );

}
    /* ==========================================
       GUARDAR PDF
    ========================================== */

    const nombreArchivo =

        `Control_Equipos_${fecha
            .toLocaleDateString("es-MX")
            .replace(/\//g,"-")}.pdf`;

    doc.save(
        nombreArchivo
    );

}
