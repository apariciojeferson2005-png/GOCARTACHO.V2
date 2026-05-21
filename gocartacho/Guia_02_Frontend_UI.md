# Guía 02: Frontend, UI y Lógica del Cliente

## 1. Stack Tecnológico del Cliente
El frontend evita usar frameworks pesados como React o Angular para este visor de mapas. En su lugar utiliza **Vanilla JavaScript (JS Puro)**, HTML5 y CSS3.
*   *¿Por qué?* Mantiene el DOM ligero, mejora el SEO (Search Engine Optimization) y garantiza tiempos de carga ultrarrápidos, esenciales para una app de mapas.

## 2. Motor de Mapas: Leaflet.js
Es la librería Open Source líder para mapas interactivos móviles.
*   **Capas (TileLayers):** Utiliza los mapas base de CARTO (`basemaps.cartocdn.com`) por su estética limpia.
*   **Polígonos Geográficos:** Los barrios (Centro Histórico, Getsemaní) se dibujan usando arrays exactos de latitud/longitud que delimitan sus fronteras físicas.
*   **Heatmap (Mapa de Calor):** Leaflet.heat renderiza los datos en tiempo real. Tiene lógica matemática en JS para normalizar la "intensidad", asegurando que 1 sola persona no pinte todo el mapa de rojo, sino que escale según la concentración real de usuarios.

## 3. Gestión del Estado y Autenticación en el Cliente
Toda la lógica de seguridad recae en el archivo `index.js` y `admin.js`.
*   **Almacenamiento Seguro:** El token JWT se guarda en `localStorage` bajo la clave `usuario_gocartacho`.
*   **Fetch Wrapper:** Se creó una función personalizada llamada `fetchWithAuth(url, options)`. Esta función intercepta todas las llamadas a la API, les inyecta el header `Authorization: Bearer <token>` y escucha si el backend devuelve un error **401 (Unauthorized)**. Si ocurre, cierra la sesión automáticamente.
*   **Renovación Silenciosa:** Hay un `setInterval` que revisa el token cada minuto. Si detecta que está a punto de expirar (menos de 5 minutos), hace una petición en segundo plano a `/api/v1/auth/refresh` para traer uno nuevo sin interrumpir la navegación del usuario.

## 4. UI/UX: Estilo "Glassmorphism" y Responsividad
*   **Glassmorphism:** Uso intensivo de `backdrop-filter: blur(20px)` y fondos semitransparentes en CSS (`rgba(255, 255, 255, 0.85)`). Esto permite que el mapa siga viéndose por debajo de los paneles y menús, dando un aspecto nativo de iOS.
*   **Mobile First (dvh):** Para evitar el clásico error donde la barra del navegador del celular (Safari/Chrome) corta la aplicación, se usó la unidad CSS moderna `100dvh` (Dynamic Viewport Height). Así la app encaja perfecto sin importar si el usuario hace scroll.
