// Layout principal de la aplicación.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// Estilos globales.

import "./globals.css";
import "../styles/dashboard.css";
import "../styles/user-menu.css";
import "../styles/table.css";
import "../styles/pagination.css";
import "../styles/forms.css";
import "../styles/modal.css";

// Configuración de la fuente principal.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Configuración de la fuente monoespaciada.

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos de la aplicación.

export const metadata: Metadata = {
  title: "Control Equipos de Cómputo",
  description: "Sistema de control de equipos de cómputo",
};

// Componente principal del layout.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es">

      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {children}
      </body>

    </html>
  );

}