# Sprint 2 – DG Car Detail
## Bitácora de desarrollo

### Día 1 – Autenticación
- Implementación de entidades User y Role.
- Endpoint /api/auth/register con validaciones.
- Asignación automática de roles (USER/ADMIN).
- Endpoint /api/auth/login con validación de credenciales.
- Persistencia en H2 y pruebas con Postman.
- Integración de registro y login en frontend (Vite/React).
- Header dinámico con saludo e iniciales del usuario.

### Día 2 – Panel de administración
- Restricción de acceso a /administración según rol ADMIN.
- Lógica de redirección y validación en frontend.
- Bloqueo de acceso en dispositivos móviles.
- Sección Productos: listado, alta y eliminación.
- Manejo de errores y validaciones.

### Día 3 – Características
- Creación de entidad Feature y repositorio.
- Endpoint /api/features GET/POST.
- Sección “Características” en admin: alta + listado.
- Integración de checkbox para asignar features a productos.

### Día 4 – Categorías
- Creación de entidad Category y repositorio.
- Endpoint /api/categories GET/POST.
- Sección “Categorías” en admin: alta + listado con miniatura.
- Asociación de categoría al producto mediante `categoryId`.

### Día 5 – Integraciones finales
- Actualización de ProductRequest y ProductController.
- Asociación de características y categoría al crear producto.
- Home con tarjetas de categorías y filtro por categoría.
- Grilla de productos responsive.
- ProductDetail completo: categoría, duración, precio, features.

### Deuda técnica (Sprint siguiente)
- Edición de productos.
- Edición/eliminación de categorías y características.
- Mejorar layout visual general (Sprint 4).
