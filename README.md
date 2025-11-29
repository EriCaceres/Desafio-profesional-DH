Shine Lab

Sistema de Reservas de Servicios de Estética Automotor
Trabajo Final – Programación 1 – Certified Tech Developer (Digital House)

1. Descripción del Proyecto

DG Car Detail es una aplicación web que permite gestionar servicios de estética automotor.
Incluye catálogo de productos, categorías, características, registro de usuarios, inicio de sesión y un panel de administración exclusivo para administradores.

El sistema está dividido en dos módulos:

Backend: Java + Spring Boot

Frontend: React + Vite

2. Tecnologías utilizadas
Backend

Java 17

Spring Boot

Spring Web

Spring Data JPA

H2 Database

Maven

Frontend

React

Vite

TailwindCSS

Axios

React Router DOM

3. Funcionalidades principales
Sprint 1

API CRUD de productos (GET, POST, DELETE).

Panel de administración para crear y eliminar productos.

Vista Home con listado, recomendaciones y detalle de productos.

Paginación y consumo del backend desde el frontend.

Documentación del Sprint.

Sprint 2

Registro de usuarios.

Login con validación de credenciales.

Asignación de roles (USER y ADMIN).

Acceso restringido al panel de administración.

CRUD de categorías.

CRUD de características.

Asociación producto → características y categoría.

Actualización visual del Home para mostrar categorías y filtros.

Documentación del Sprint 2.

4. Estructura del proyecto
dg-car-detail/
│
├── backend/
│   ├── src/main/java/com/dgcars/backend/
│   │   ├── product/
│   │   ├── feature/
│   │   ├── category/
│   │   └── user/
│   ├── src/main/resources/
│   └── pom.xml
│
└── frontend/
    ├── src/components/
    ├── src/pages/
    ├── src/services/
    ├── package.json
    └── vite.config.js

5. Ejecución del proyecto
Backend

Abrir IntelliJ o cualquier IDE Java.

Abrir carpeta backend/.

Ejecutar la clase BackendApplication.

El servidor se inicia en
http://localhost:8080

Frontend

Abrir terminal dentro de frontend/.

Instalar dependencias:

npm install


Ejecutar el servidor de desarrollo:

npm run dev


Abrir http://localhost:5173

6. Endpoints principales
Productos
GET    /api/products
GET    /api/products/{id}
POST   /api/products
DELETE /api/products/{id}

Categorías
GET    /api/categories
POST   /api/categories

Características
GET    /api/features
POST   /api/features

Autenticación
POST   /api/auth/register
POST   /api/auth/login

7. Usuarios y roles

El registro crea usuarios con rol "USER".

Si el usuario se registra con correo que comienza con "admin@", se asigna automáticamente el rol "ADMIN".

Solo usuarios con rol ADMIN pueden acceder al panel /administracion.

8. Panel de administración

Incluye:

Creación de productos

Eliminación de productos

Creación de categorías

Creación de características

Listado de productos y características

Acceso bloqueado en móvil (según consigna)

9. Documentación de Sprint

En la carpeta /docs se encuentran:

sprint1-documentacion.md

sprint2-bitacora.md

10. Instalación rápida (TL;DR)

Backend:

Ejecutar BackendApplication

Frontend:

npm install
npm run dev


Abrir navegador en:

Frontend: http://localhost:5173

Backend: http://localhost:8080
