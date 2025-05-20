<template>
  <div class="events-page-wrapper">
    <div class="events-main-box">
      <h1 class="page-title">Mis Eventos</h1>

      <div class="action-buttons-container">
        <router-link to="/crear-eventos" class="action-button">
          <i class="fas fa-plus-circle"></i> Crear Evento
        </router-link>
      </div>

      <div class="events-grid">
        <router-link
          v-for="evento in eventos"
          :key="evento.id"
          :to="`/editar-evento/${evento.id}`"
          class="event-card-link"
        >
          <div class="event-card">
            <img
              :src="getImageUrl(evento.imagen)"
              alt="Imagen del evento"
              class="event-image"
            />

            <div class="event-card-content">
              <h2 class="event-name">{{ evento.nombre }}</h2>

              <p class="event-detail">
                <i class="fas fa-calendar-alt"></i> Fecha: {{ formatDate(evento.fecha) }}
              </p>

              <p class="event-detail">
                <i class="fas fa-clock"></i> Hora: {{ evento.hora }}
              </p>

              </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MisEventos',
  data() {
    return {
      eventos: []
    };
  },
  methods: {
    async fetchEventos() {
      try {
        const organizadorId = localStorage.getItem('userId');

        if (!organizadorId) {
          return console.error("No se encontró el ID del organizador.");
        }

        // Asumiendo que esta ruta podría necesitar un token, si es una ruta protegida
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const response = await axios.get(`http://localhost:3000/api/events/organizador/${organizadorId}`, config);
        this.eventos = response.data;
      } catch (error) {
        console.error('Error al obtener los eventos del organizador:', error);
        // Podrías añadir un mensaje al usuario aquí, por ejemplo:
        // alert('Hubo un error al cargar tus eventos. Inténtalo de nuevo más tarde.');
      }
    },
    getImageUrl(nombreArchivo) {
      return nombreArchivo ? `http://localhost:3000/uploads/${nombreArchivo}` : '';
    },
    formatDate(fecha) {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }
  },
  mounted() {
    this.fetchEventos();
  }
};
</script>

<style scoped>
/* Importa Font Awesome para los íconos */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Contenedor principal de la página, replicando el fondo suave */
.events-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinea arriba para que el contenido fluya */
  min-height: 100vh; /* Ocupa al menos toda la altura de la ventana */
  padding: 40px 20px; /* Padding para el contenido general */
  background-color: #f0f2f5; /* Un color de fondo suave */
  box-sizing: border-box;
}

/* Caja principal que contiene el título, botones y la cuadrícula de eventos */
.events-main-box {
  background-color: rgba(255, 255, 255, 0.95); /* Blanco semitransparente para la caja */
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
  width: 100%;
  max-width: 1200px; /* Ancho máximo para el contenido */
  box-sizing: border-box;
}

/* Título de la página */
.page-title {
  text-align: center;
  color: #173788; /* Color principal */
  margin-bottom: 40px;
  font-size: 2.8rem; /* Un poco más grande */
  font-weight: bold;
}

/* Contenedor de botones de acción */
.action-buttons-container {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 20px; /* Espacio entre botones si hubiera más de uno */
}

/* Estilo para los botones de acción principales (Crear Evento) */
.action-button {
  display: inline-flex; /* Para alinear el ícono con el texto */
  align-items: center;
  background-color: #173788; /* Color principal */
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.action-button i {
  margin-right: 10px; /* Espacio entre el ícono y el texto */
  font-size: 1.3rem;
}

.action-button:hover {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
  transform: translateY(-2px);
}

/* Cuadrícula de eventos */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Mínimo 300px, flexible */
  gap: 30px; /* Espacio entre las tarjetas */
  margin-top: 30px;
}

.event-card-link {
  text-decoration: none;
  color: inherit; /* Hereda el color del texto para el enlace */
  display: block; /* Asegura que el enlace ocupe todo el espacio de la tarjeta */
}

/* Estilo de la tarjeta de evento */
.event-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden; /* Para que la imagen no se salga */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); /* Sombra más pronunciada */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column; /* Organiza el contenido verticalmente */
  height: 100%; /* Asegura que todas las tarjetas tengan la misma altura si están en una fila */
}

.event-card:hover {
  transform: translateY(-8px); /* Efecto de elevación */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15); /* Sombra más fuerte al pasar el ratón */
}

.event-image {
  width: 100%;
  height: 200px; /* Altura fija para todas las imágenes */
  object-fit: cover; /* Recorta la imagen para cubrir el espacio */
  border-bottom: 1px solid #eee; /* Separador de imagen */
}

.event-card-content {
  padding: 25px; /* Padding interno del contenido de la tarjeta */
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Permite que el contenido ocupe el espacio restante */
}

/* Se renombró de .event-title a .event-name para consistencia */
.event-name {
  font-size: 1.8rem; /* Título más grande */
  color: #173788; /* Color principal */
  font-weight: bold;
  margin-bottom: 15px; /* Más espacio */
}

/* Se renombró de .event-date, .event-time a .event-detail para agrupar */
.event-detail {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 8px; /* Espacio entre detalles */
  display: flex;
  align-items: center; /* Alinea ícono y texto */
}

.event-detail i {
  margin-right: 10px; /* Espacio entre ícono y texto */
  color: #173788; /* Color para los íconos */
  font-size: 1.2rem; /* Tamaño de ícono */
}

/* Media Queries para responsividad */
@media (max-width: 992px) {
  .events-main-box {
    padding: 40px;
  }
  .page-title {
    font-size: 2.4rem;
  }
  .action-button {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
  }
  .event-name {
    font-size: 1.6rem;
  }
  .event-detail {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .events-page-wrapper {
    padding: 20px 15px;
  }
  .events-main-box {
    padding: 30px;
  }
  .page-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  .action-buttons-container {
    flex-direction: column; /* Apila los botones en pantallas pequeñas */
    gap: 15px;
    margin-bottom: 30px;
  }
  .action-button {
    width: 90%; /* Ancho completo */
    margin: 0 auto; /* Centrar */
  }
  .events-grid {
    grid-template-columns: 1fr; /* Una columna en móvil */
    gap: 25px;
  }
  .event-card-content {
    padding: 20px;
  }
  .event-name {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
  .event-detail {
    font-size: 0.95rem;
  }
  .event-detail i {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .events-main-box {
    padding: 20px;
  }
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }
  .action-button {
    font-size: 1rem;
    padding: 10px 20px;
  }
  .event-card-content {
    padding: 15px;
  }
  .event-name {
    font-size: 1.3rem;
  }
  .event-image {
    height: 180px;
  }
}
</style>