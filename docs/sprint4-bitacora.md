# Sprint 4 – Bitácora y Documentación

**Proyecto:** DG Car Detail – Sistema de Reservas de Servicios de Estética Automotor  
**Certificación:** Certified Tech Developer – Digital House  
**Sprint:** 4 | **Meta:** Desarrollar la funcionalidad de Reserva de Productos

---

## 1. Descripción de la solución

DG Car Detail es una aplicación web para gestionar servicios de estética automotor. En este sprint se implementó el módulo completo de reservas, permitiendo a los usuarios autenticados reservar servicios, consultar su historial y comunicarse con el proveedor vía WhatsApp.

---

## 2. User Stories completadas

### #30 – Reservas: Seleccionar fecha ✅ (Alta)

**Descripción:** Como usuario, quiero poder realizar búsquedas por fecha para encontrar productos disponibles.

**Implementación:**
- Al hacer clic en "Reservar" en `ProductDetail.jsx`, se verifica si el usuario está logueado via `localStorage`.
- Si no está logueado, se redirige a `/login` con estado `{ mandatory: true, from: '/products/:id/booking' }`.
- El login muestra un banner indicando que el registro es obligatorio.
- En `BookingPage.jsx` se muestra un selector de rango de fechas con inputs `type="date"`.
- Se consulta `GET /api/reservations/blocked/:productId` para obtener fechas ocupadas.
- Se valida que el rango seleccionado no incluya fechas bloqueadas antes de enviar.

**Criterios de aceptación verificados:** ✅ Todos

---

### #31 – Reservas: Visualizar detalles ✅ (Alta)

**Descripción:** Como usuario autenticado, quiero poder visualizar la página de reservas con el detalle del producto.

**Implementación:**
- `BookingPage.jsx` muestra: nombre, descripción, duración, precio, categoría y características del producto.
- Muestra los datos del usuario logueado: nombre, apellido y email (leídos desde localStorage).
- Muestra el rango de fechas seleccionado en tiempo real.
- Incluye botón "Confirmar reserva" para hacer el submit.

**Criterios de aceptación verificados:** ✅ Todos

---

### #32 – Realizar reserva ✅ (Alta)

**Descripción:** Como usuario autenticado, quiero poder realizar reservas para poder utilizar los productos.

**Implementación:**
- `POST /api/reservations` recibe `{ userId, productId, startDate, endDate }`.
- El backend valida: fechas no nulas, inicio < fin, sin fechas pasadas, sin solapamiento con otras reservas.
- Si hay error, el backend devuelve un mensaje específico (400 o 409) que el frontend muestra al usuario.
- Si la reserva es exitosa, se muestra una pantalla de confirmación con todos los detalles.

**Criterios de aceptación verificados:** ✅ Todos

---

### #33 – Acceder a historial ✅ (Media)

**Descripción:** Como usuario autenticado, quiero poder visualizar mis reservas anteriores.

**Implementación:**
- Nueva página `/mis-reservas` (`MyReservations.jsx`).
- Llama a `GET /api/reservations/user/:userId`.
- Las reservas se ordenan por fecha descendente (más recientes primero).
- Cada reserva muestra: nombre del servicio, período, precio, duración y fecha de reserva.
- Badge visual diferencia reservas "Próximas" vs "Finalizadas".
- Link a la página en el Navbar cuando el usuario está logueado.

**Criterios de aceptación verificados:** ✅ Todos

---

### #34 – WhatsApp: Iniciar chat ✅ (Baja)

**Descripción:** Como usuario, quiero comunicarme con el proveedor vía WhatsApp.

**Implementación:**
- Componente `WhatsAppButton.jsx` con ícono SVG oficial de WhatsApp.
- Posicionado fijo en la esquina inferior derecha (`position: fixed; bottom: 1.5rem; right: 1.5rem`).
- Abre `https://wa.me/{número}?text={mensaje predefinido}` en nueva pestaña.
- No requiere que el usuario esté logueado.
- Tooltip visible al hacer hover con el mensaje "¿Tenés dudas? ¡Escribinos!".
- Responsive: funciona en móviles y tablets.

**Criterios de aceptación verificados:** ✅ Todos

---

### #35 – Notificación: Confirmar reserva por correo ⏳ (Baja)

**Descripción:** Como usuario registrado, quiero recibir un correo con los datos de mi reserva.

**Estado:** Pendiente de implementación.  
**Nota:** Se requiere integrar JavaMailSender (Spring Boot) o un servicio externo como SendGrid/Resend. Queda planificado para implementación futura dado que es de prioridad baja.

---

## 3. Arquitectura del módulo de reservas

### Backend

```
backend/src/main/java/com/dgcars/backend/reservation/
├── Reservation.java          # Entidad JPA
├── ReservationRepository.java # Queries personalizadas
├── ReservationDTO.java        # Request, Response y BlockedDates
├── ReservationService.java    # Lógica de negocio y validaciones
└── ReservationController.java # Endpoints REST
```

### Endpoints nuevos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/reservations` | Crear nueva reserva |
| GET | `/api/reservations/user/:userId` | Historial del usuario |
| GET | `/api/reservations/blocked/:productId` | Fechas ocupadas del producto |

### Frontend

```
frontend/src/
├── pages/
│   ├── BookingPage.jsx        # Reserva + confirmación (#31, #32)
│   └── MyReservations.jsx     # Historial (#33)
├── components/
│   └── WhatsAppButton.jsx     # Botón flotante (#34)
└── styles/
    ├── BookingPage.css
    ├── MyReservations.css
    └── WhatsAppButton.css
```

### Rutas agregadas a App.jsx

```jsx
<Route path="/products/:id/booking" element={<BookingPage />} />
<Route path="/mis-reservas" element={<MyReservations />} />
<WhatsAppButton />   {/* fuera de Routes, siempre visible */}
```

---

## 4. Validaciones implementadas

| Validación | Dónde |
|-----------|-------|
| Usuario logueado antes de reservar | Frontend (ProductDetail + BookingPage) |
| Fechas no nulas | Frontend + Backend |
| Fecha inicio < fecha fin | Frontend + Backend |
| Sin fechas pasadas | Frontend + Backend |
| Sin solapamiento con otras reservas | Backend (query SQL) |
| Mensaje de error específico si falla | Frontend (muestra respuesta del backend) |

---

## 5. Casos de prueba (Testing/QA)

### CP-01: Reserva exitosa
- **Precondición:** Usuario logueado, producto disponible.
- **Pasos:** Ir a detalle → Seleccionar fechas libres → Confirmar.
- **Resultado esperado:** Pantalla de confirmación con datos de la reserva.

### CP-02: Intento de reserva sin login
- **Pasos:** Ir a detalle del producto sin estar logueado → Clic en Reservar.
- **Resultado esperado:** Redirige a `/login` con banner "El login es obligatorio".

### CP-03: Fechas solapadas
- **Precondición:** Producto con reserva del 10/03 al 15/03.
- **Pasos:** Seleccionar 12/03 al 17/03 → Confirmar.
- **Resultado esperado:** Mensaje de error "El rango de fechas ya está reservado".

### CP-04: Fecha de inicio igual o posterior a fin
- **Pasos:** Poner startDate = 20/03, endDate = 18/03 → Confirmar.
- **Resultado esperado:** Error "La fecha de inicio debe ser anterior a la fecha de fin".

### CP-05: Historial vacío
- **Precondición:** Usuario sin reservas.
- **Pasos:** Ir a `/mis-reservas`.
- **Resultado esperado:** Mensaje "No tenés reservas todavía" con botón para explorar.

### CP-06: Historial con reservas
- **Precondición:** Usuario con 2+ reservas.
- **Pasos:** Ir a `/mis-reservas`.
- **Resultado esperado:** Lista ordenada con badges "Próxima" / "Finalizada".

### CP-07: Botón WhatsApp
- **Pasos:** Abrir cualquier página de la app → Clic en botón verde inferior derecho.
- **Resultado esperado:** Se abre WhatsApp Web/App con número precargado.

### CP-08: Botón WhatsApp sin login
- **Pasos:** No loguearse → Hacer clic en WhatsApp.
- **Resultado esperado:** Abre WhatsApp igualmente (no requiere autenticación).

---

## 6. Decisiones técnicas

- Se usó **H2** como base de datos para simplicidad del entorno de desarrollo.
- Las fechas se manejan como `LocalDate` (sin hora) porque los servicios son por día, no por horario específico.
- La validación de solapamiento usa una query JPQL con lógica `start < endB AND end > startB` para cubrir todos los casos de superposición.
- El frontend no usa librería de calendario externa para minimizar dependencias; los inputs `type="date"` nativos son suficientes para los requisitos del sprint.

---

## 7. Integrantes del equipo

| Rol | Responsabilidad |
|-----|----------------|
| Scrum Master | Documentación y gestión del sprint |
| TL Frontend | BookingPage, MyReservations, WhatsAppButton |
| TL Backend | Reservation entity, service, controller, repository |
| TL QA/Testing | Casos de prueba y ejecución |
