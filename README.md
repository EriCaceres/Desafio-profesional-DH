# ShineLab – Sistema de Reservas de Servicios de Detailing  
Proyecto final – Certified Tech Developer – Digital House

---------------------------------------------------------

## Descripción del proyecto

ShineLab es una plataforma web desarrollada para gestionar reservas de servicios de detailing automotor.  
Permite a los usuarios explorar servicios, ver detalles y reservar turnos (en sprints posteriores).  
Incluye un panel de administración desde donde se gestionan los servicios del catálogo.

El proyecto está dividido en dos módulos principales:
- Backend: API REST en Java Spring Boot  
- Frontend: Aplicación en React + Vite  

Este repositorio contiene todo el desarrollo correspondiente al Sprint 1.

---------------------------------------------------------

## Tecnologías utilizadas

Frontend:
- React  
- Vite  
- React Router  
- TailwindCSS  
- Axios  

Backend:
- Java 17  
- Spring Boot  
- Spring Web  
- Spring Data JPA  
- Base de datos H2 o MySQL  

Infraestructura:
- Git / GitHub  
- Arquitectura REST  
- Proyecto organizado en carpetas /frontend y /backend  

---------------------------------------------------------

## Funcionalidades implementadas en el Sprint 1

User Stories completadas:

1. Header del sitio (US #1):  
   Header fijo, responsive, con logo, lema y botones de sesión.

2. Main con secciones (US #2):  
   Secciones de buscador (maquetado), categorías y recomendaciones.

3. Registrar producto (US #3):  
   Formulario en Administración, validación de nombre único, guardado en BD.

4. Productos aleatorios (US #4):  
   Se muestran hasta 10 productos aleatorios en la sección “Recomendaciones”.

5. Detalle del producto (US #5):  
   Se visualiza título, botón volver, descripción y layout definido.

6. Galería de imágenes (US #6):  
   Una imagen principal y cuatro imágenes pequeñas. Botón “Ver más”.

7. Footer del sitio (US #7):  
   Footer responsive, con año y copyright.

8. Paginación (US #8):  
   Lista paginada de todos los servicios, con botones Inicio/Anterior/Siguiente.

9. Panel de administración (US #9):  
   Acceso desde /administración, solo desktop, incluye menú de funciones.

10. Listar productos (US #10):  
    Tabla con ID, nombre y acciones.

11. Eliminar producto (US #11):  
    Eliminación con confirmación y refresco automático.

---------------------------------------------------------

## Endpoints principales del backend

GET     /api/products  
GET     /api/products/random?limit=10  
GET     /api/products/{id}  
POST    /api/products  
DELETE  /api/products/{id}  

---------------------------------------------------------

## Estructura del repositorio

/backend  
  ├── Product.java  
  ├── ProductRepository.java  
  ├── ProductController.java  
  └── ...  

/frontend  
  ├── src/components  
  ├── src/pages  
  ├── App.jsx  
  ├── services/api.js  
  └── ...  

/docs  
  ├── definicion-proyecto.pdf  
  ├── bitacora-sprint1.pdf  
  └── casos-de-prueba.xlsx  

---------------------------------------------------------

## Testing – Sprint 1

Se realizaron casos de prueba funcionales cubriendo:

- Header  
- Registro de producto  
- Listado  
- Eliminación  
- Detalle  
- Galería  
- Paginación  
- Footer  

Los casos de prueba se encuentran en:  
/docs/casos-de-prueba.xlsx

---------------------------------------------------------

## Documentación del Sprint

Toda la documentación solicitada se incluye en la carpeta `/docs`, conteniendo:

- Definición del proyecto  
- Identidad visual  
- Bitácora  
- Casos de prueba  

---------------------------------------------------------

## Cómo correr el proyecto

Backend:
cd backend  
mvn spring-boot:run  

Frontend:
cd frontend  
npm install  
npm run dev  

Acceso:
http://localhost:5173/

---------------------------------------------------------

## Autora

Erika Cáceres  
Certified Tech Developer – Digital House  
Córdoba, Argentina

---------------------------------------------------------

## Estado del proyecto

Sprint 1 COMPLETADO  
Listo para avanzar al Sprint 2.


