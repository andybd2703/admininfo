<template>
  <div class="container">
    <h1 class="title">Mis Eventos</h1>

    <!-- Botones -->
    <div class="botones-container">
      <router-link to="/crear-eventos" class="btn">Crear Evento</router-link>
      </div>

    <div class="events-grid">
      <router-link
        v-for="evento in eventos"
        :key="evento.id"
        :to="`/editar-evento/${evento.id}`"
        class="event-card-link"
      >
        <div class="event-card">
          <!-- Imagen del evento -->
          <img
            :src="getImageUrl(evento.imagen)"
            alt="Imagen del evento"
            class="event-image"
          />

          <!-- Título del evento -->
          <h2 class="event-title">{{ evento.nombre }}</h2>

          <!-- Fecha del evento -->
          <p class="event-date">Fecha: {{ formatDate(evento.fecha) }}</p>

          <!-- Hora del evento -->
          <p class="event-time">Hora: {{ evento.hora }}</p>
        </div>
      </router-link>
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

        const response = await axios.get(`http://localhost:3000/api/events/organizador/${organizadorId}`);
        this.eventos = response.data;
      } catch (error) {
        console.error('Error al obtener los eventos del organizador:', error);
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
.container {
  padding: 2rem;
  background-color: #f8f9fa;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Botones */
.botones-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn {
  background-color: #007bff;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
}

.btn:hover {
  background-color: #0056b3;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.event-card-link {
  text-decoration: none;
}

.event-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s;
}

.event-card:hover {
  transform: scale(1.02);
}

.event-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-title {
  padding: 1rem 1rem 0.5rem;
  font-size: 1.2rem;
  color: #333;
}

.event-date, .event-time {
  padding-bottom: 1rem;
  font-size: 0.95rem;
  color: #666;
}
</style>
