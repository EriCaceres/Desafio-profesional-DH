# 🚗 ShineLab – Sistema de Reservas de Servicios de Detailing

Aplicación web full stack para gestionar reservas de servicios de estética automotor. Los usuarios pueden explorar servicios, reservar turnos, marcar favoritos y calificar los servicios que utilizaron. Los administradores gestionan productos, categorías, características y usuarios desde un panel dedicado.

---

## 🛠️ Tecnologías

### Backend
| Tecnología | Versión |
|---|---|
| Java | 17 |
| Spring Boot | 3.x |
| Spring Security + JWT | 3.x |
| BCrypt | (incluido en Spring Security) |
| H2 Database | en memoria |
| Maven | 3.x |

### Frontend
| Tecnología | Versión |
|---|---|
| React | 19.1 |
| Vite | 7.x |
| TailwindCSS | 3.4 |
| Axios | 1.11 |
| React Router DOM | 7.x |
| React Date Range | 2.x |

---

## ⚙️ Instalación local

### Requisitos previos
- Java 17+
- Node.js 18+
- Maven 3.x

### 1. Clonar el repositorio

```bash
git clone https://github.com/EriCaceres/Desafio-profesional-DH.git
cd Desafio-profesional-DH
```

### 2. Configurar el Backend

```bash
cd backend
```

Crear el archivo de variable de entorno o configurarla en el IDE:

```
MAIL_PASSWORD=tu_contraseña_de_aplicacion_gmail
```

> 📌 Ver sección **Configuración de Email** para obtener la contraseña de aplicación de Gmail.

Levantar el backend:

```bash
mvn spring-boot:run
```

El servidor arranca en `http://localhost:8080`

La base de datos H2 se inicializa automáticamente con datos de prueba al iniciar.

### 3. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend arranca en `http://localhost:5173`

---

## 🔐 Variables de entorno

### Backend – `application.properties`

```properties
spring.mail.username=tu_email@gmail.com
spring.mail.password=${MAIL_PASSWORD:}
app.mail.from=tu_email@gmail.com
```

### Configuración de Email (Gmail)

Para habilitar el envío de emails de confirmación:

1. Activar verificación en dos pasos en tu cuenta Google
2. Ir a: https://myaccount.google.com/apppasswords
3. Crear una contraseña de aplicación (nombre: ShineLab)
4. Usar esa clave de 16 caracteres como valor de `MAIL_PASSWORD`

---

## 👤 Usuario de prueba precargado

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@shinelab.com | admin123 |

---

## 📡 Endpoints de API

### Auth
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/login` | Login y obtención de token JWT | ❌ |

### Productos
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/products` | Listar todos los productos | ❌ |
| GET | `/api/products/{id}` | Obtener detalle de producto | ❌ |
| GET | `/api/products/search?query=` | Buscar productos | ❌ |
| POST | `/api/products` | Crear producto | ✅ ADMIN |
| PUT | `/api/products/{id}` | Editar producto | ✅ ADMIN |
| DELETE | `/api/products/{id}` | Eliminar producto | ✅ ADMIN |

### Categorías
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/categories` | Listar categorías | ❌ |
| POST | `/api/categories` | Crear categoría | ✅ ADMIN |
| DELETE | `/api/categories/{id}` | Eliminar categoría | ✅ ADMIN |

### Características
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/features` | Listar características | ❌ |
| POST | `/api/features` | Crear característica | ✅ ADMIN |
| PUT | `/api/features/{id}` | Editar característica | ✅ ADMIN |
| DELETE | `/api/features/{id}` | Eliminar característica | ✅ ADMIN |

### Reservas (Bookings)
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| POST | `/api/bookings` | Crear reserva | ✅ |
| GET | `/api/bookings/occupied?date=` | Horarios ocupados en una fecha | ❌ |
| GET | `/api/bookings/user/{userId}` | Historial de reservas del usuario | ✅ |
| GET | `/api/bookings/product/{productId}` | Reservas por producto | ❌ |

### Calificaciones
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/ratings/product/{productId}` | Ver reseñas de un producto | ❌ |
| GET | `/api/ratings/can-rate?productId=&userId=` | Verificar si puede calificar | ✅ |
| POST | `/api/ratings` | Crear calificación | ✅ |

### Usuarios
| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| GET | `/api/users` | Listar usuarios | ✅ ADMIN |
| POST | `/api/users/{id}/roles/admin` | Dar rol admin | ✅ ADMIN |
| DELETE | `/api/users/{id}/roles/admin` | Quitar rol admin | ✅ ADMIN |

---

## 🧪 Testing

Las pruebas se realizaron de forma manual utilizando **Postman** para los endpoints del backend y pruebas funcionales en el navegador para el frontend.

### Casos de prueba principales

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | Registrar usuario nuevo | Usuario creado, redirige al home |
| 2 | Login con credenciales incorrectas | Mensaje de error específico |
| 3 | Acceder a /admin sin ser admin | Redirige al home |
| 4 | Crear reserva en horario ocupado | Error 409 con mensaje descriptivo |
| 5 | Calificar servicio sin reserva previa | Error 403 |
| 6 | Calificar el mismo servicio dos veces | Error 409 |
| 7 | Crear producto sin categoría | Validación rechaza el formulario |
| 8 | Email de confirmación de reserva | Llega al correo del usuario |

---

## 📋 Funcionalidades principales

- 🔍 **Búsqueda** de servicios por nombre y fecha
- 🗂️ **Filtro por categorías**
- ❤️ **Favoritos** — marcar y listar servicios favoritos
- 📅 **Reservas** — selección de fecha y horario, con validación de disponibilidad
- 📧 **Email de confirmación** automático al realizar una reserva
- ⭐ **Calificaciones** — puntuar servicios reservados
- 🔒 **Autenticación** con JWT y roles (USER / ADMIN)
- 🛡️ **Panel de administración** — gestión de productos, categorías, características y usuarios
- 💬 **WhatsApp** — botón de contacto directo

---

## 🗄️ Base de datos

Se utiliza **H2 en memoria**. La base de datos se crea automáticamente al iniciar el backend y se carga con datos iniciales desde `src/main/resources/data.sql`.

Los datos iniciales incluyen:
- 3 categorías (Lavados rápidos, Protección y pulido, Detailing completo)
- 6 características
- 10 productos de ejemplo
- 1 usuario administrador precargado

> ⚠️ Al reiniciar el backend los datos vuelven al estado inicial (H2 en memoria).

---

## 👩‍💻 Desarrollado por

**Erika Cáceres**
Certified Tech Developer – Digital House 2026
📧 erii.caceres@hotmail.com
🔗 [GitHub](https://github.com/EriCaceres)
