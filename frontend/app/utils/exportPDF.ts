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
       INSERTAR LOGOS
    ========================================== */

// Agricultura
doc.addImage(
    logo1,
    "PNG",
    10,
    8,
    56,
    18
);

// Liconsa
doc.addImage(
    logo2,
    "PNG",
    58,
    8,
    52,
    18
);

// Margarita
doc.addImage(
    logo3,
    "PNG",
    114,
    8,
    35,
    18
);

    /* ==========================================
       TÍTULO
    ========================================== */

    doc.setFont("helvetica", "bold");

    doc.setFontSize(22);

    doc.setTextColor(138, 32, 54);

    doc.text(
    "Control Equipos de Cómputo",
    165,
    36,
    {
        align: "center"
    }
);

    /* ==========================================
       SUBTÍTULO
    ========================================== */

    doc.setFontSize(11);

    doc.setFont("helvetica", "normal");

    doc.setTextColor(90);

   doc.text(
    "Sistema de Gestión de Activos Informáticos",
    165,
    44,
    {
        align: "center"
    }
);

    /* ==========================================
       FECHA Y HORA
    ========================================== */

    const fecha = new Date();

    doc.setFontSize(10);

    doc.setTextColor(60);

doc.text(
    `Fecha: ${fecha.toLocaleDateString("es-MX")}`,
    14,
    50
);

doc.text(
    `Hora: ${fecha.toLocaleTimeString("es-MX")}`,
    72,
    50
);

doc.text(
    `Total de registros: ${impresoras.length}`,
    235,
    50
);

    /* ==========================================
       TABLA
    ========================================== */

    autoTable(doc, {

        startY: 58,

        theme: "grid",

        head: [[

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

        body: impresoras.map((imp) => [

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

        headStyles: {

            fillColor: [138, 32, 54],

            textColor: [255, 255, 255],

            halign: "center",

            fontStyle: "bold"

        },

        styles: {

    fontSize: 7,

    cellPadding: 1.6,

    overflow: "linebreak"

},

                /* ==========================================
           ESTILOS DE FILAS ALTERNADAS
        ========================================== */

        alternateRowStyles: {

            fillColor: [248, 248, 248]

        },

        /* ==========================================
           ESTILOS GENERALES
        ========================================== */

margin: {

    top:58,

    left:10,

    right:10,

    bottom:20

},

        didDrawPage: (data) => {

            /* ======================================
               LÍNEA INFERIOR DEL ENCABEZADO
            ======================================= */

            doc.setDrawColor(138, 32, 54);

            doc.setLineWidth(.5);

           doc.line(
    10,
    54,
    287,
    54
);

        }

    });

    /* ==========================================
       PIE DE PÁGINA
    ========================================== */

    const paginas = doc.getNumberOfPages();

    for (

        let pagina = 1;

        pagina <= paginas;

        pagina++

    ) {

        doc.setPage(pagina);

        doc.setDrawColor(220);

        doc.line(

            10,

            196,

            287,

            196

        );

        doc.setFont(

            "helvetica",

            "normal"

        );

        doc.setFontSize(9);

        doc.setTextColor(90);

        doc.text(

    "Sistema Control Equipos de Cómputo",

    10,

    201

);

doc.text(

    "Generado automáticamente",

    90,

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
            .replace(/\//g, "-")}.pdf`;

    doc.save(

        nombreArchivo

    );

}