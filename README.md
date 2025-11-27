# 🚗 ShineLab – Sistema de Reservas de Servicios de Detailing  
Proyecto final – Certified Tech Developer – Digital House

---

## 📌 Descripción del proyecto

**ShineLab** es una plataforma web desarrollada para gestionar reservas de servicios de *detailing automotor*.  
Permite a los usuarios explorar servicios, ver detalles, revisar disponibilidad (en sprints posteriores) y reservar un turno.  
Incluye un **panel de administración** desde donde se gestionan los servicios/productos del catálogo.

El proyecto está dividido en *dos módulos principales*:
- **Backend:** API REST en Java Spring Boot  
- **Frontend:** SPA en React + Vite  

Este repositorio contiene todo el desarrollo correspondiente al **Sprint 1**.

---

## 🛠 Tecnologías utilizadas

### **Frontend**
- React + Vite  
- React Router  
- TailwindCSS  
- Axios

### **Backend**
- Java 17  
- Spring Boot  
- Spring Web  
- Spring Data JPA  
- H2 o MySQL (configurable)

### **Infraestructura**
- Git / GitHub  
- Arquitectura REST  
- Proyecto modularizado (`/frontend` y `/backend`)

---

## 🚀 Funcionalidades implementadas en el Sprint 1

### ✔ **US #1 – Header del sitio**
- Fijo y responsive  
- Logo + lema + botones de registro/login  

### ✔ **US #2 – Main con secciones**
- Buscador (maquetado)
- Categorías
- Recomendaciones  

### ✔ **US #3 – Registrar producto (Admin)**
- Formulario funcional  
- Validación de nombre único  
- Guardado en BD  
- Refresco automático

### ✔ **US #4 – Productos aleatorios en el home**
- Hasta 10 productos  
- Sin repeticiones  
- Llamado a `/api/products/random`

### ✔ **US #5 – Detalle del producto**
- Título  
- Botón “Volver”

