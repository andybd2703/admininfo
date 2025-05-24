¿Qué es SIDE?
SIDE es una plataforma web integral para la gestión de eventos y la compra de entradas. El sistema admite dos tipos principales de usuarios:

Asistentes a eventos: Explorar eventos, comprar entradas, gestionar favoritos y completar transacciones.

Organizadores de eventos: Crear, editar y gestionar eventos, incluyendo la carga de imágenes y los detalles de los eventos.

La plataforma funciona como una aplicación de página única (SPA) moderna con un frontend de Vue.js que se comunica con un backend de Node.js/Express a través de API REST, respaldado por una base de datos MySQL.
 La plataforma SIDE se basa en tecnologías modernas de desarrollo web, organizadas en pilas frontend y backend:

Frontend Framework Vue.js 3.5.13 Framework de interfaz de usuario basado en componentes
Enrutamiento Vue Router 4.5.0 Navegación del lado del cliente
Cliente HTTP Axios 1.9.0 Comunicación API
Frontend Framework Bootstrap 5.3.5 Diseño y componentes responsivos
Frontend Framework Express.js Servidor API REST
Base de datos MySQL con controlador MySQL2 Persistencia de datos
Autenticación JWT (jsonwebtoken + jwt-decode) Autenticación sin estado
Subida de archivos Multer Procesamiento y almacenamiento de imágenes
Seguridad bcryptjs, helmet, cors Hashing de contraseñas y encabezados de seguridad
Generación de PDF pdfkit, puppeteer Generación de facturas.
