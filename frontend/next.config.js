// CONFIGURACIÓN DE NEXT.JS

/** @type {import('next').NextConfig} */

const nextConfig = {

  // ORÍGENES PERMITIDOS DURANTE EL DESARROLLO

  allowedDevOrigins: [
    "192.168.0.120",
  ],

};

// EXPORTAR CONFIGURACIÓN

module.exports = nextConfig;