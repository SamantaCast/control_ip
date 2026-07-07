# Control de Direcciones IP

Sistema web para la administración y control de direcciones IP asignadas dentro de la infraestructura informática de LICONSA.

Permite registrar, consultar, editar y eliminar direcciones IP, asociándolas con el usuario, equipo, departamento, edificio y ubicación correspondiente. Además, incluye autenticación de administradores, filtros avanzados, ordenamiento de registros, exportación de reportes y estadísticas del sistema.

---

# Características

- Inicio de sesión mediante JWT.
- Administración de direcciones IP.
- Administración de usuarios administradores.
- Registro de:
  - Departamento
  - Edificio
  - Ubicación
  - Usuario
  - Equipo
  - Correo electrónico
  - Dirección IP
  - Código de inventario
- Búsqueda dinámica.
- Filtros por:
  - Departamento
  - Edificio
  - Ubicación
  - Equipo
- Ordenamiento por columnas.
- Paginación.
- Estadísticas generales.
- Exportación a Excel.
- Exportación a PDF.
- Diseño responsivo.

---

# Tecnologías utilizadas

## Frontend

- Next.js
- React
- TypeScript
- Axios
- SweetAlert2
- FontAwesome
- ExcelJS
- jsPDF
- jspdf-autotable
- File Saver

## Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

---

# Estructura del proyecto

```
frontend
│
├── app
│   ├── dashboard
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── EquipmentTable.tsx
│   │   ├── Pagination.tsx
│   │   ├── EquipmentModal.tsx
│   │   ├── AdminModal.tsx
│   │   ├── AdminListModal.tsx
│   │   ├── page.tsx
│   │   └── types.ts
│   │
│   ├── utils
│   │   ├── exportExcel.ts
│   │   └── exportPDF.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public
│   ├── logos
│   └── fonts
│
├── styles
│   ├── dashboard.css
│   ├── forms.css
│   ├── modal.css
│   ├── pagination.css
│   ├── searchbar.css
│   ├── table.css
│   └── user-menu.css
│
└── package.json
```

---

# Funcionalidades

## Gestión de direcciones IP

- Registrar nuevas direcciones IP.
- Editar registros.
- Eliminar registros.
- Consultar información.
- Buscar registros.
- Ordenar por cualquier columna.
- Paginación.
- Exportar información.

---

## Administración

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

Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Backend

```env
MONGODB_URI=

JWT_SECRET=
```

---

# Instalación

Clonar el repositorio

```bash
git clone https://github.com/usuario/control-direcciones-ip.git
```

Entrar al proyecto

```bash
cd control-direcciones-ip
```

Instalar dependencias

```bash
npm install
```

Ejecutar el proyecto

```bash
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
- Contraseñas cifradas.
- Manejo de sesiones expiradas.

---

# Autor

Departamento de Informática

LECHE PARA EL BIENESTAR S.A DE C.V

Sistema de Control de Direcciones IP

---

# Licencia

Este proyecto fue desarrollado para uso interno de la organización.