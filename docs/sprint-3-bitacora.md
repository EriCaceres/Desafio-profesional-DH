# Sprint 3 – Entrega Final

## 1. Historias de Usuario Implementadas

### ✔ US #22 – Búsqueda de productos por rango de fechas
**Objetivo:** permitir que el usuario seleccione un rango de fechas desde la pantalla principal y ver únicamente los servicios que se encuentran disponibles.

**Funcionalidades desarrolladas:**
- Se agregó un calendario de rango de fechas en el Home.
- Botón “Buscar disponibilidad”.
- Endpoint backend:  
  `GET /api/products/available?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd`
- Filtrado de productos según disponibilidad (sin reservas dentro del rango).
- Botón “Limpiar búsqueda” para restablecer el listado inicial.
- Resultados mostrados manteniendo estructura visual del Home.

---

### ✔ US #23 – Visualización de disponibilidad en el detalle del producto
**Objetivo:** mostrar en la ficha del producto un calendario con fechas ocupadas bloqueadas.

**Funcionalidades desarrolladas:**
- Nuevo endpoint backend:  
  `GET /api/bookings/product/{productId}`
- Componente `BookingCalendar.jsx` que:
  - Obtiene las reservas del producto.
  - Construye `disabledDates` con fechas reservadas.
  - Renderiza calendario tipo “DateRange”.
- Integración del calendario dentro del detalle del producto.
- Manejo de fechas inválidas y errores básicos.

---

## 2. Cambios Técnicos Destacados

### Backend
- Creación de `ProductAvailabilityController.java`.
- Agregado método:
  ```java
  findByProductIdAndDateBetween()
en BookingRepository.

Ajustes en serialización del campo password usando:

java
Copiar código
@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
para ocultar el password en las respuestas.

Endpoint para listar reservas por producto.

Frontend
Nuevo componente: BookingCalendar.jsx.

Actualización de ProductDetail.jsx para incluir disponibilidad.

Actualización completa de Home.jsx con lógica de búsqueda por rangos de fecha.

Uso de librería react-date-range.

3. Pruebas de funcionamiento realizadas
Búsqueda de rango sin reservas → productos disponibles mostrados correctamente.

Búsqueda de rango con reservas → productos ocupados excluidos.

Calendario en detalle mostrando fechas bloqueadas.

Reserva nueva → fecha inmediatamente bloqueada en detalle.

Limpieza de búsqueda → restauración correcta del listado.

Manejo básico de errores (fechas inválidas, rango invertido).

4. Conclusión del Sprint
El Sprint 3 permitió completar la lógica fundamental para el sistema de reservas:

El usuario puede conocer qué servicios están disponibles antes de reservar.

El detalle de cada servicio muestra fechas ocupadas, evitando conflictos.

El backend ahora soporta consultas precisas de disponibilidad.

El frontend integra la experiencia de búsqueda y calendario de forma coherente.

Con esto queda preparada la base para el Sprint 4: proceso de reserva, formulario, confirmación y visualización de turnos del usuario.

yaml
Copiar código

---

# ✅ **DOCUMENTO 2 — sprint-3-tests.md**  
*(copiar y pegar tal cual en tu repo)*

```md
# Sprint 3 – Casos de Prueba

## 1. Búsqueda por rango de fechas (US #22)

| ID | Escenario | Precondición | Pasos | Resultado Esperado | Resultado Obtenido |
|----|-----------|--------------|-------|---------------------|---------------------|
| TC-22-01 | Buscar rango sin reservas | Existen productos sin reservas | Seleccionar rango → Buscar | Se muestran productos disponibles | OK |
| TC-22-02 | Buscar rango con reservas | Producto X tiene reservas el 05/12 | Seleccionar 05/12–06/12 → Buscar | Producto X no aparece en resultados | OK |
| TC-22-03 | Limpiar búsqueda | Se realizó una búsqueda | Click en “Limpiar búsqueda” | Se restablece el listado completo | OK |
| TC-22-04 | Fechas inválidas | Introducir rango invertido | Seleccionar fin < inicio → Buscar | Error y no se rompe la app | OK |

---

## 2. Disponibilidad en el detalle (US #23)

| ID | Escenario | Precondición | Pasos | Resultado Esperado | Resultado Obtenido |
|----|-----------|--------------|-------|---------------------|---------------------|
| TC-23-01 | Ver calendario sin reservas | Producto sin reservas | Entrar al detalle | Calendario sin fechas bloqueadas | OK |
| TC-23-02 | Ver calendario con reservas | Producto con reserva 05/12 | Entrar al detalle | 05/12 aparece deshabilitada | OK |
| TC-23-03 | Crear reserva y verla bloqueada | Backend funcional | Crear reserva 10/12 → Refrescar detalle | Fecha 10/12 bloqueada | OK |
| TC-23-04 | Error de red | API booking caída | Entrar al detalle | Consola muestra error, calendario carga rango por defecto | OK |

---

## 3. Validación de endpoint `/products/available`

| ID | Escenario | Precondición | Pasos | Resultado Esperado | Resultado Obtenido |
|----|-----------|--------------|-------|---------------------|---------------------|
| TC-API-01 | Rango libre | Producto sin reservas | GET /available | Lista completa de productos | OK |
| TC-API-02 | Rango ocupado | Producto A reservado 05/12 | GET con rango que incluye 05/12 | Producto A excluido | OK |
| TC-API-03 | Fechas inválidas | - | GET con formato incorrecto | Error 400 y mensaje claro | OK |

---

## 4. Estado general del Sprint

Todos los casos de prueba ejecutados resultaron satisfactorios.  
La funcionalidad es estable tanto en frontend como en backend.