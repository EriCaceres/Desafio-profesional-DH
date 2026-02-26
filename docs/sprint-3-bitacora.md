# Sprint 3 - Documentación y Bitácora
## Proyecto: DG Car Detail - Sistema de Reservas de Estética Automotor

**Programa:** Certified Tech Developer - Digital House  
**Curso:** Trabajo Final - Programación  
**Sprint:** 3  
**Fecha de inicio:** [Fecha inicio]  
**Fecha de finalización:** [Fecha fin]  
**Scrum Master:** Eri Cáceres

---

## 1. DEFINICIÓN DEL PROYECTO

### 1.1 Descripción General

DG Car Detail es una aplicación web integral diseñada para gestionar servicios de estética automotor. El sistema permite a los usuarios explorar un catálogo completo de servicios, realizar búsquedas personalizadas, visualizar disponibilidad en tiempo real, gestionar favoritos, y realizar reservas de manera eficiente.

### 1.2 Objetivo del Sprint 3

Implementar funcionalidades avanzadas de búsqueda, gestión de favoritos, compartir en redes sociales, y sistema de puntuaciones para mejorar la experiencia del usuario y aumentar el engagement con la plataforma.

### 1.3 Tecnologías Utilizadas

**Backend:**
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database (desarrollo)
- Maven

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Axios
- React Router DOM

**Herramientas de Desarrollo:**
- Git/GitHub
- IntelliJ IDEA
- Visual Studio Code
- Postman (testing API)

---

## 2. USER STORIES DEL SPRINT 3

### 2.1 User Story #22: Realizar búsqueda (ALTA)

**Como** usuario  
**Quiero** poder realizar búsquedas de productos  
**Para** encontrar los resultados que mejor se adapten a lo que busco

**Criterios de Aceptación:**
- ✅ Bloque buscador con título y descripción clara
- ✅ Campo de búsqueda con autocompletado
- ✅ Calendario doble para selección de rango de fechas
- ✅ Botón de búsqueda claramente identificable
- ✅ Resultados relevantes y precisos
- ✅ Feedback interactivo con sugerencias
- ✅ Diseño intuitivo y fácil de usar
- ✅ Mantener diseño de página principal

**Estado:** ✅ COMPLETADA

---

### 2.2 User Story #23: Visualizar disponibilidad (ALTA)

**Como** usuario  
**Quiero** poder visualizar las fechas disponibles en la ficha del producto  
**Para** poder acceder a la sección de reservas

**Criterios de Aceptación:**
- ✅ Calendario doble en detalle del producto
- ✅ Destacar visualmente fechas disponibles
- ✅ Indicador visual de fechas ocupadas (color diferente)
- ✅ Manejo de errores con mensajes claros
- ✅ Opción de reintentar si falla la carga

**Estado:** ✅ COMPLETADA

---

### 2.3 User Story #24: Marcar como favorito (MEDIA)

**Como** usuario autenticado  
**Quiero** poder marcar productos como favoritos desde la lista del home  
**Para** poder acceder a ellos posteriormente

**Criterios de Aceptación:**
- ✅ Botón/ícono de favorito visible en cada card
- ✅ Marcar/desmarcar con un solo clic
- ✅ Interacción intuitiva sin confusión
- ✅ Compatible con todos los dispositivos (responsive)

**Estado:** ✅ COMPLETADA

---

### 2.4 User Story #25: Listar productos favoritos (MEDIA)

**Como** usuario autenticado  
**Quiero** poder acceder a mi lista de favoritos  
**Para** ver los productos que marqué previamente

**Criterios de Aceptación:**
- ✅ Acceso desde cuenta de usuario o sección específica
- ✅ Actualización en tiempo real al marcar/desmarcar
- ✅ Opción de eliminar productos de favoritos
- ✅ Compatible con todos los dispositivos

**Estado:** ✅ COMPLETADA

---

### 2.5 User Story #26: Ver bloque de políticas del producto (MEDIA)

**Como** usuario  
**Quiero** poder visualizar la política de uso de un producto  
**Para** informarme sobre cuidados y precauciones

**Criterios de Aceptación:**
- ✅ Bloque ocupa 100% del contenedor
- ✅ Título claramente identificable y subrayado
- ✅ Políticas distribuidas en columnas
- ✅ Cada política con título y descripción detallada

**Estado:** ✅ COMPLETADA

**Políticas Implementadas:**
1. Cancelación
2. Puntualidad
3. Estado del vehículo
4. Garantía del servicio
5. Métodos de pago
6. Seguridad

---

### 2.6 User Story #27: Compartir productos en redes sociales (BAJA)

**Como** usuario  
**Quiero** poder compartir productos en redes sociales  
**Para** poder recomendarlos a otros usuarios

**Criterios de Aceptación:**
- ✅ Botón "compartir" visible en detalle del producto
- ✅ Ventana emergente al hacer clic
- ✅ Opciones: Facebook, Twitter, Instagram, WhatsApp, LinkedIn
- ✅ Mostrar imagen, descripción y enlace del producto
- ✅ Mensaje personalizable por el usuario
- ✅ Integración con API de cada red social
- ✅ Funcionalidad de copiar enlace directo

**Estado:** ✅ COMPLETADA

**Implementación Técnica:**
- Componente `ShareModal.jsx` con todas las redes sociales
- Componente `ShareButton.jsx` para abrir el modal
- Integración nativa con APIs de compartir de cada plataforma
- Funcionalidad de copiar enlace al portapapeles

---

### 2.7 User Story #28: Puntuar producto (BAJA)

**Como** usuario que realizó una reserva  
**Quiero** poder puntuar los productos con estrellas  
**Para** dar mi opinión

**Criterios de Aceptación:**
- ✅ Solo usuarios con reserva finalizada pueden puntuar
- ✅ Sección de valoraciones visible en detalle del producto
- ✅ Sistema de 1-5 estrellas
- ✅ Mostrar puntuación, nombre de usuario, fecha y comentario
- ✅ Usuarios autenticados pueden escribir reseña detallada
- ✅ Puntuación media dinámica y en tiempo real
- ✅ Mostrar puntuación media y total de valoraciones

**Estado:** ✅ COMPLETADA

---

### 2.8 User Story #29: Eliminar categoría (BAJA)

**Como** administrador  
**Quiero** poder eliminar categorías que ya no se utilizarán  
**Para** mantener el catálogo organizado y actualizado

**Criterios de Aceptación:**
- ✅ Opción clara en panel de administración
- ✅ Mecanismo de confirmación preventivo
- ✅ Alerta indicando categoría a eliminar y consecuencias
- ✅ Opciones de "Confirmar" o "Cancelar"

**Estado:** ✅ COMPLETADA

---

## 3. DAILY SCRUMS

### 3.1 Daily Scrum - Día 1
**Fecha:** [Fecha]

**¿Qué hice ayer?**
- Revisión del backlog del Sprint 3
- Análisis de user stories de alta prioridad

**¿Qué haré hoy?**
- Implementar búsqueda de productos (#22)
- Crear componente de calendario para fechas

**Impedimentos:**
- Ninguno

---

### 3.2 Daily Scrum - Día 2
**Fecha:** [Fecha]

**¿Qué hice ayer?**
- Completada funcionalidad de búsqueda (#22)
- Implementado calendario de disponibilidad

**¿Qué haré hoy?**
- Finalizar visualización de disponibilidad (#23)
- Comenzar sistema de favoritos (#24)

**Impedimentos:**
- Ninguno

---

### 3.3 Daily Scrum - Día 3
**Fecha:** [Fecha]

**¿Qué hice ayer?**
- Completada visualización de disponibilidad (#23)
- Implementado marcar como favorito (#24)

**¿Qué haré hoy?**
- Completar lista de favoritos (#25)
- Implementar bloque de políticas (#26)

**Impedimentos:**
- Ninguno

---

### 3.4 Daily Scrum - Día 4
**Fecha:** [Fecha]

**¿Qué hice ayer?**
- Completada lista de favoritos (#25)
- Implementado bloque de políticas (#26)

**¿Qué haré hoy?**
- Iniciar funcionalidad de compartir en redes (#27)
- Revisar sistema de puntuaciones existente (#28)

**Impedimentos:**
- Ninguno

---

### 3.5 Daily Scrum - Día 5
**Fecha:** [Fecha]

**¿Qué hice ayer?**
- Completada funcionalidad de compartir (#27)
- Verificado sistema de puntuaciones (#28)

**¿Qué haré hoy?**
- Verificar funcionalidad de eliminar categoría (#29)
- Testing integral de todas las funcionalidades
- Preparar documentación

**Impedimentos:**
- Ninguno

---

## 4. DECISIONES TÉCNICAS

### 4.1 Frontend

**Búsqueda (#22):**
- Implementación de búsqueda en tiempo real con debounce
- Uso de React Router para mantener estado en URL
- Integración con backend mediante endpoint `/api/products/search`

**Calendario de Disponibilidad (#23):**
- Componente `BookingCalendar.jsx` reutilizable
- Lógica para deshabilitar fechas ocupadas
- Integración con sistema de reservas

**Sistema de Favoritos (#24, #25):**
- Estado global manejado con Context API
- Persistencia en localStorage para usuarios autenticados
- Sincronización con backend mediante endpoints dedicados

**Compartir en Redes (#27):**
- Modal centralizado con `ShareModal.jsx`
- URLs dinámicas generadas con `window.location.origin`
- Integración nativa con APIs de compartir de cada plataforma
- No requiere autenticación OAuth

### 4.2 Backend

**Endpoints Nuevos:**
```
GET /api/products/search?query={term}
GET /api/products/{id}/availability?start={date}&end={date}
POST /api/favorites
GET /api/favorites
DELETE /api/favorites/{id}
```

**Base de Datos:**
- Tabla `favorites` con relación many-to-many entre users y products
- Índices en campos de búsqueda para optimizar queries

---

## 5. MÉTRICAS DEL SPRINT

### 5.1 Velocity

**User Stories Completadas:** 8 de 8 (100%)

**Distribución por Prioridad:**
- Alta: 2/2 (100%)
- Media: 3/3 (100%)
- Baja: 3/3 (100%)

### 5.2 Calidad

**Bugs Encontrados:** 0 críticos, 2 menores
**Bugs Resueltos:** 2/2 (100%)
**Cobertura de Tests:** Pendiente implementación de suite completa

---

## 6. RETROSPECTIVA

### 6.1 ¿Qué funcionó bien?

1. **Organización del trabajo:** La división de user stories por prioridad permitió enfocarse primero en lo más importante.

2. **Reutilización de componentes:** El componente `BookingCalendar` se diseñó de manera modular, facilitando su uso en múltiples contextos.

3. **Comunicación clara:** Los criterios de aceptación detallados facilitaron la implementación sin ambigüedades.

4. **Integración fluida:** La arquitectura REST existente permitió agregar nuevos endpoints sin refactorización mayor.

5. **Diseño responsive:** Todas las funcionalidades se implementaron mobile-first.

### 6.2 ¿Qué se puede mejorar?

1. **Testing:** Falta implementar suite completa de tests unitarios y de integración.

2. **Documentación de código:** Algunos componentes complejos necesitan más comentarios explicativos.

3. **Optimización de performance:** El sistema de búsqueda podría beneficiarse de caché en el frontend.

4. **Accesibilidad:** Faltan algunas etiquetas ARIA y navegación por teclado en componentes interactivos.

5. **Internacionalización:** El sistema está hardcodeado en español, debería soportar múltiples idiomas.

### 6.3 Acciones para el próximo Sprint

1. Implementar suite completa de tests con Jest y React Testing Library
2. Agregar Storybook para documentación de componentes
3. Implementar sistema de caché con React Query
4. Auditoría de accesibilidad con Lighthouse
5. Configurar i18n con react-i18next

---

## 7. REPOSITORIO Y COMMITS

### 7.1 Estructura de Commits

Todos los commits siguen la convención:
```
type(scope): descripción breve

- Detalle 1
- Detalle 2
```

**Tipos utilizados:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Documentación
- `style`: Cambios de formato
- `refactor`: Refactorización de código
- `test`: Agregar tests

### 7.2 Branches

- `main`: Rama principal estable
- `develop`: Rama de desarrollo
- `feature/sprint3-search`: Búsqueda de productos
- `feature/sprint3-favorites`: Sistema de favoritos
- `feature/sprint3-share`: Compartir en redes
- `feature/sprint3-reviews`: Sistema de puntuaciones

---

## 8. ENTREGABLES COMPLETADOS

### 8.1 Código

✅ **Backend:**
- ProductController actualizado con endpoint de búsqueda
- Servicios para favoritos
- Validaciones y manejo de errores

✅ **Frontend:**
- 3 nuevos componentes (ShareModal, ShareButton, componentes de favoritos)
- Actualización de ProductDetail con todas las funcionalidades
- Estilos responsive para todos los nuevos componentes

### 8.2 Documentación

✅ **Documentación técnica:**
- README actualizado
- Documentación de API
- Guía de instalación y configuración

✅ **Documentación de Sprint:**
- Bitácora completa (este documento)
- Daily Scrums documentados
- Retrospectiva detallada

### 8.3 Testing

✅ **Plan de Testing:**
- Casos de prueba definidos para todas las user stories
- Matriz de ejecución de tests
- Reporte de bugs y resoluciones

---

## 9. CONCLUSIONES

El Sprint 3 se completó exitosamente con todas las user stories implementadas según los criterios de aceptación. El equipo demostró buena capacidad de organización y ejecución, logrando entregar funcionalidades de calidad en tiempo y forma.

Las funcionalidades implementadas mejoran significativamente la experiencia del usuario, agregando capacidades de búsqueda avanzada, gestión de favoritos, y engagement social mediante el sistema de compartir y puntuaciones.

Para el siguiente sprint, se recomienda enfocarse en testing automatizado, optimización de performance, y mejoras de accesibilidad para llevar el producto a un nivel de calidad production-ready.

---

**Documento preparado por:** Erika Cáceres  
**Rol:** Scrum Master  
**Fecha:** Febrero 2026  
**Versión:** 1.0