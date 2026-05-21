# Estructura de Base de Datos - Go Cartacho (MongoDB)

A continuación se detallan las colecciones de la base de datos, sus campos exactos y los tipos de datos que Spring Boot y el Frontend esperan recibir para funcionar correctamente sin errores.

---

## 1. Colección: `usuarios`
Almacena la información de los perfiles (turistas, comerciantes y administradores).

| Campo | Tipo de Dato (MongoDB / Java) | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único del usuario. |
| `nombre` | `String` | Nombre del usuario. |
| `apellido` | `String` | Apellido del usuario. |
| `username` | `String` | Nombre de usuario (único). |
| `email` | `String` | Correo electrónico (único). |
| `contrasena` | `String` | Contraseña encriptada (BCrypt). |
| `rol` | `String` (Enum) | Roles permitidos: `USER`, `COMERCIANTE`, `ADMIN`, `SUPER_ADMIN`. |
| `fotoUrl` | `String` | URL o Base64 de la foto de perfil. |
| `biografia` | `String` | Descripción del perfil del usuario. |
| `tipoViajero` | `String` | Ej. Mochilero, Familiar, Lujo. |
| `proveedor` | `String` (Enum) | Método de autenticación: `LOCAL` o `GOOGLE`. |
| `fechaRegistro` | `Date` (LocalDateTime) | Fecha y hora en la que se registró. |

---

## 2. Colección: `zonas`
Delimita geográficamente los barrios o áreas turísticas de Cartagena.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único de la zona. |
| `nombre` | `String` | Nombre (Ej. "Centro Histórico", "Getsemaní"). |
| `numero` | `Integer` | Identificador numérico rápido para relacionar con polígonos del mapa. |
| `descripcion` | `String` | Breve reseña del barrio. |
| `latitud` | `Double` / `Decimal128` | Coordenada Y del centro de la zona. |
| `longitud` | `Double` / `Decimal128` | Coordenada X del centro de la zona. |
*(Nota: `nivelConcurrencia` no se guarda en esta colección, se calcula en vivo cruzando con `afluencia_historica`)*.

---

## 3. Colección: `tipos_negocio`
Categorías principales para clasificar los comercios.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único. |
| `nombre` | `String` | Ej. "Restaurante", "Bar", "Museo", "Hotel". |
| `descripcion` | `String` | Detalles de la categoría. |

---

## 4. Colección: `comercios`
La colección central del sistema. Los campos `zonaId` y `tipoNegocioId` establecen las conexiones.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único del comercio. |
| `nombre` | `String` | Nombre del local. |
| `descripcion` | `String` | Descripción comercial. |
| `direccion` | `String` | Dirección física. |
| `latitud` | `Double` / `Decimal128` | Para el pin en el mapa. |
| `longitud` | `Double` / `Decimal128` | Para el pin en el mapa. |
| `ubicacion` | `GeoJsonPoint` | Formato `{ type: "Point", coordinates: [lng, lat] }` para búsquedas de cercanía en MongoDB. |
| `tipoNegocioId` | `String` | ID del tipo de negocio asociado (Referencia). |
| `zonaId` | `String` | ID de la zona geográfica asociada (Referencia). |
| `propietarioId` | `String` | ID del usuario comerciante (Referencia). |
| `estadoAprobacion`| `String` (Enum) | `PENDIENTE`, `APROBADO`, `RECHAZADO`, `INACTIVO`. |
| `imagenUrl` | `String` | URL de la foto principal. |
| `horarioApertura` | `String` (LocalTime) | Ej. "08:00:00" |
| `horarioCierre` | `String` (LocalTime) | Ej. "22:00:00" |
| `telefono` | `String` | Teléfono o WhatsApp de contacto. |
| `emailContacto` | `String` | Email del negocio. |
| `promedioCalificacion`| `Double` | Caché del rating de estrellas (Ej. 4.5). |
| `totalResenas` | `Integer` | Caché de cantidad de comentarios. |

---

## 5. Colección: `promociones`
Ofertas vinculadas a un comercio en particular.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único. |
| `titulo` | `String` | Nombre de la promo. |
| `descripcion` | `String` | Condiciones y detalles. |
| `porcentajeDescuento`| `Double` | Valor numérico del descuento (Ej. 20.0). |
| `fechaInicio` | `Date` (LocalDate) | Cuándo arranca. |
| `fechaFin` | `Date` (LocalDate) | Cuándo expira. |
| `activa` | `Boolean` | `true` si es visible, `false` si fue pausada. |
| `comercioId` | `String` | Referencia al `_id` del comercio dueño. |

---

## 6. Colección: `planes`
Rutas turísticas (agrupadores).

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único. |
| `nombrePlan` | `String` | Ej. "Tour Gastronómico". |
| `descripcion` | `String` | Resumen del recorrido. |
| `promedioCalificacion`| `Double` | Promedio sumado de los locales incluidos. |

---

## 7. Colección: `planes_comercios`
Tabla/Colección intermedia que conecta los Planes con los Comercios, estableciendo un orden.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único de esta relación. |
| `planId` | `String` | Referencia al `_id` del Plan. |
| `comercioId` | `String` | Referencia al `_id` del Comercio. |
| `orden` | `Integer` | El número de paso en la ruta (1, 2, 3...). |
| `recomendacion` | `String` | Tip o consejo específico para esta parada. |

---

## 8. Colección: `resenas`
Comentarios y calificaciones dejadas por los usuarios a los comercios.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único. |
| `calificacion` | `Integer` | Estrellas del 1 al 5. |
| `comentario` | `String` | Texto de la opinión. |
| `fecha` | `Date` (LocalDateTime) | Cuándo se hizo. |
| `usuarioId` | `String` | Referencia al autor (`_id` del usuario). |
| `comercioId` | `String` | Referencia al lugar calificado. |
| `reportada` | `Boolean` | `true` si un usuario marcó el comentario como falso/inapropiado. |

---

## 9. Colección: `puntos_calor`
Datos efímeros en tiempo real para generar el mapa de calor (Heatmap).

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador. |
| `latitud` | `Double` | Ubicación exacta del dispositivo. |
| `longitud` | `Double` | Ubicación exacta del dispositivo. |
| `timestamp` | `Date` (LocalDateTime) | Hora de la captura (expiran automáticamente). |
| `dispositivoHash` | `String` | Identificador anónimo del dispositivo para no contar dobles. |

---

## 10. Colección: `afluencia_historica`
Registros fijos del nivel de tráfico de cada zona dependiendo del día y la hora.

| Campo | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `_id` | `ObjectId` (String) | Identificador único. |
| `zonaId` | `String` | Referencia a la zona de Cartagena. |
| `diaSemana` | `String` (Enum) | `Lunes`, `Martes`, `Miércoles`, etc. |
| `hora` | `Integer` | Hora en formato 24h (0 a 23). |
| `nivelPromedio` | `String` (Enum) | `Bajo` (0), `Medio` (1), `Alto` (2), `Muy_Alto` (3). |