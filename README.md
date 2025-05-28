¿Qué es SIDE?
SIDE es una plataforma web integral para la gestión de eventos y la compra de entradas. El sistema admite dos tipos principales de usuarios:

->Asistentes a eventos: Explorar eventos, comprar entradas, gestionar favoritos y completar transacciones.

->rganizadores de eventos: Crear, editar y gestionar eventos, incluyendo la carga de imágenes y los detalles de los eventos.

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

->Componentes del Frontend:
El frontend de Vue.js se organiza en torno a componentes a nivel de página que gestionan flujos de trabajo específicos del usuario:

SIDEHome.vue: Página de inicio con carrusel de eventos y visualización de cuadrícula de eventos
EventDetail.vue: Información individual del evento y punto de entrada para la selección de entradas
CompraBoletas.vue: Selección de la cantidad de entradas y adición al carrito
Cart.vue: Revisión y modificación del carrito de compra
FormularioCompra.vue: Proceso de pago y gestión de pagos
CrearEventos.vue: Formulario de creación de eventos para organizadores
EditarEvento.vue: Interfaz de edición de eventos para organizadores
Estructura de la API del Backend
El backend de Express.js expone API RESTful organizadas por dominio funcional:

/api/auth: Autenticación de usuarios y gestión de sesiones
/api/events: Operaciones CRUD de eventos, búsqueda y filtrado
/api/carrito: Gestión del carrito de compra
/api/compra: Procesamiento de compras y generación de facturas
/api/favoritos: Gestión de favoritos del usuario
/uploads/*: Servicio de archivos estáticos para imágenes subidas.

->Esta guía proporciona instrucciones paso a paso para configurar y ejecutar la plataforma de gestión de eventos SIDE localmente. Abarca los prerrequisitos, la instalación, la configuración y la ejecución de los componentes frontend y backend del sistema.

Para obtener información sobre la arquitectura general del sistema y la pila tecnológica, consulte Arquitectura del sistema. Para obtener documentación detallada de la API necesaria durante el desarrollo, consulte la Referencia de la API.

->Pre requisitos
Antes de configurar la plataforma SIDE, asegúrese de tener instalados los siguientes componentes en su equipo de desarrollo:

Requisito Versión Propósito
Node.js 16.x o superior Entorno de ejecución para frontend y backend
npm 8.x o superior Gestor de paquetes
MySQL 8.x o superior Servidor de bases de datos
GitHub Última versión Control.

-> Links de Documentacion de SIDE TEAM.
->GitDiagram
https://gitdiagram.com/andybd2703/admininfo
->DeepWiki
https://deepwiki.com/andybd2703/admininfo/1-overview
->Trello
https://trello.com/b/VGFZEcfc/side-team
