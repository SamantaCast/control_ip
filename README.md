# Control de Direcciones IP

Sistema web para la administración y control de direcciones IP, equipos de cómputo e impresoras de **Leche para el Bienestar S.A. de C.V.**

---

# Descripción

**Control de Direcciones IP** es una aplicación web desarrollada para facilitar la administración de las direcciones IP asignadas a los equipos de cómputo e impresoras de la organización.

Permite registrar, consultar, actualizar y eliminar información de los dispositivos, además de administrar usuarios del sistema, realizar búsquedas, aplicar filtros, generar estadísticas y exportar reportes.

---

# Características

- Inicio de sesión mediante autenticación JWT.
- Administración de direcciones IP.
- Administración de usuarios administradores.
- Registro de:
  - Departamento.
  - Edificio.
  - Ubicación.
  - Usuario.
  - Equipo.
  - Correo electrónico.
  - Dirección IP.
  - Código de inventario.
- Búsqueda dinámica.
- Filtros por:
  - Departamento.
  - Edificio.
  - Ubicación.
  - Equipo.
- Ordenamiento por columnas.
- Paginación.
- Estadísticas generales.
- Exportación a Excel.
- Exportación a PDF.
- Interfaz responsiva.

---

# Tecnologías utilizadas

## Frontend

- Next.js
- React
- TypeScript
- Axios
- SweetAlert2
- Font Awesome
- ExcelJS
- jsPDF
- jspdf-autotable
- File Saver

## Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- bcrypt

---

# Estructura del proyecto

```text
Control_IP
│
├── backend
│   ├── config
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── utils
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── public
│   ├── styles
│   ├── .env.local
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
│
└── README.md
```

---

# Funcionalidades

## Gestión de direcciones IP

- Registrar direcciones IP.
- Editar registros.
- Eliminar registros.
- Consultar información.
- Buscar registros.
- Ordenar información por columnas.
- Paginación.
- Exportar información.

---

## Administración de usuarios

- Inicio de sesión.
- Crear administradores.
- Editar administradores.
- Eliminar administradores.
- Validación de contraseñas.
- Control de permisos.

---

# Estadísticas

El sistema muestra información general como:

- Total de registros.
- Total de usuarios.
- Total de direcciones IP.

---

# Variables de entorno

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Backend

```env
MONGODB_URI=

JWT_SECRET=

PORT=5000
```

---

# Instalación

## Clonar el repositorio

```bash
git clone https://github.com/SamantaCast/control_ip.git
```

## Instalar dependencias del backend

```bash
cd backend
npm install
npm start
```

## Instalar dependencias del frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

# Exportación de reportes

El sistema permite generar reportes en:

- Excel (.xlsx)
- PDF (.pdf)

Los reportes incluyen:

- Logos institucionales.
- Fecha y hora de generación.
- Total de registros.
- Diseño institucional.

---

# Seguridad

- Autenticación mediante JWT.
- Protección de rutas.
- Control de acceso por administradores.
- Contraseñas cifradas mediante bcrypt.
- Manejo de sesiones expiradas.

---

# Autor

**Departamento de Informática**

**Leche para el Bienestar S.A. de C.V.**

Sistema de Control de Direcciones IP.

---

# Licencia

Proyecto desarrollado para uso interno de **Leche para el Bienestar S.A. de C.V.**