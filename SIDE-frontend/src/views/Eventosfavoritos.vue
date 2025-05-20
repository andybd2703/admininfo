<template>
  <div class="events-page-wrapper">
    <div class="events-main-box">
      <h1 class="page-title">🌟 Mis Eventos Favoritos</h1>

      <div class="filters-section">
        <div class="search-bar input-group">
          <input type="text" placeholder="Buscar en mis favoritos..." class="form-control form-control-xl" v-model="searchQuery">
          <span class="input-icon"><i class="fas fa-search fa-2x"></i></span>
        </div>

        <div class="category-filters">
          </div>
      </div>

      <div v-if="loading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Cargando eventos favoritos...
      </div>

      <div v-else-if="eventosFiltrados.length === 0" class="empty-state-message">
        <p>No se encontro el evento 😢</p>
        <p>¡Explora los eventos y añade tus preferidos!</p>
        <router-link to="/eventos" class="action-button">
          Ver Eventos
        </router-link>
      </div>

      <div v-else class="events-grid">
        <router-link
          v-for="evento in eventosFiltrados"
          :key="evento.id"
          :to="`/detalle-evento/${evento.id}`"
          class="event-card-link"
        >
          <div class="event-card">
            <img
              :src="getImageUrl(evento.imagen)"
              alt="Imagen del evento"
              class="event-image"
            />

            <div class="event-card-content">
              <h3 class="event-name">{{ evento.nombre }}</h3>

              <p class="event-detail">
                <i class="fas fa-calendar-alt"></i> Fecha: {{ formatDate(evento.fecha) }}
              </p>

              <p class="event-detail">
                <i class="fas fa-clock"></i> Hora: {{ evento.hora }}
              </p>

              <div class="event-actions">
                <button @click.prevent="eliminarDeFavoritos(evento.id)" class="remove-favorite-btn">
                  <i class="fas fa-heart-broken"></i> Quitar de Favoritos
                </button>
                </div>
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
  name: 'EventsCategories', // El nombre original, aunque ahora cargue favoritos
  data() {
    return {
      eventos: [],
      loading: true,
      searchQuery: '', // Para la funcionalidad de búsqueda
      // Puedes añadir más data para filtros si los necesitas
    };
  },
  computed: {
    eventosFiltrados() {
      if (!this.searchQuery) {
        return this.eventos;
      }
      const query = this.searchQuery.toLowerCase();
      return this.eventos.filter(evento =>
        evento.nombre.toLowerCase().includes(query) ||
        this.formatDate(evento.fecha).toLowerCase().includes(query) ||
        evento.hora.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async fetchEventos() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const usuario_id = localStorage.getItem('userId');

        const response = await axios.get(`http://localhost:3000/api/favoritos/${usuario_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.eventos = response.data;
      } catch (error) {
        console.error('Error al obtener los eventos favoritos:', error);
        // Manejo de errores visual aquí si es necesario
      } finally {
        this.loading = false;
      }
    },
    async eliminarDeFavoritos(eventoId) {
      // Previene la navegación al hacer clic en el botón dentro del router-link
      event.stopPropagation();
      event.preventDefault();

      try {
        const token = localStorage.getItem('token');
        const usuario_id = localStorage.getItem('userId');

        await axios.delete(`http://localhost:3000/api/favoritos/remove/${usuario_id}/${eventoId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Actualiza la lista de eventos después de eliminar
        this.eventos = this.eventos.filter(evento => evento.id !== eventoId);
        // Opcional: mostrar un mensaje de éxito al usuario
      } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        // Manejo de errores visual
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
    },
    formatPrice(price) { // Función para formato de precio si añades precios
      return Number(price).toFixed(2);
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

/* Contenedor principal de la página, sin la imagen de fondo */
.events-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinea arriba para que el contenido fluya */
  min-height: 100vh; /* Ocupa al menos toda la altura de la ventana */
  padding: 40px 20px; /* Padding para el contenido general */
  background-color: #f0f2f5; /* Un color de fondo suave, en lugar de imagen */
  box-sizing: border-box;
}

/* Caja principal que contiene el título, filtros y la cuadrícula de eventos */
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

/* Sección de filtros y búsqueda */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0; /* Separador sutil */
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px; /* Ancho máximo para la barra de búsqueda */
  margin: 0 auto; /* Centrar la barra de búsqueda */
}

.form-control-xl {
  width: 100%;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.2rem;
  box-sizing: border-box;
  padding-right: 50px; /* Espacio para el ícono */
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  color: #777;
  font-size: 1.5rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.filter-btn {
  background-color: #f0f0f0;
  color: #173788;
  border: 2px solid #173788;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background-color: #173788;
  color: white;
}

.filter-btn.active {
  background-color: #173788;
  color: white;
  box-shadow: 0 2px 8px rgba(23, 55, 136, 0.3);
}

/* Mensajes de estado (carga, vacío) */
.loading-message,
.empty-state-message {
  text-align: center;
  font-size: 1.6rem;
  color: #555;
  margin-top: 50px;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 12px;
  background-color: #fdfdfd;
}

.loading-message i {
  margin-right: 10px;
  color: #173788;
}

.empty-state-message p {
  margin-bottom: 15px;
}

.action-button {
  display: inline-block;
  background-color: #173788;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.2rem;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: bold;
}

.action-button:hover {
  background-color: #0056b3;
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

.event-name {
  font-size: 1.8rem; /* Título más grande */
  color: #173788; /* Color principal */
  font-weight: bold;
  margin-bottom: 15px; /* Más espacio */
}

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

.event-price {
  font-size: 1.5rem;
  color: #173788; /* Color principal */
  font-weight: bold;
  margin-top: 20px;
  text-align: right;
  border-top: 1px dashed #eee;
  padding-top: 15px;
}

.event-actions {
  margin-top: auto; /* Empuja los botones hacia abajo en la tarjeta */
  padding-top: 20px;
  border-top: 1px solid #eee; /* Separador para los botones */
  display: flex;
  flex-direction: column; /* Apila los botones */
  gap: 15px; /* Espacio entre botones */
}

.remove-favorite-btn {
  background-color: #dc3545; /* Rojo para "quitar" */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
  width: 100%; /* Ocupa todo el ancho */
}

.remove-favorite-btn:hover {
  background-color: #c82333; /* Rojo más oscuro al hover */
}

/* Estilos de botones generales, heredados de componentes anteriores */
.btn.btn-primary.btn-xl {
  background-color: #173788;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  font-weight: bold;
}

.btn.btn-primary.btn-xl:hover {
  background-color: #0056b3;
}


/* Media Queries para responsividad */
@media (max-width: 992px) {
  .events-main-box {
    padding: 40px;
  }
  .page-title {
    font-size: 2.4rem;
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
  .filters-section {
    gap: 15px;
    margin-bottom: 30px;
    padding-bottom: 20px;
  }
  .form-control-xl {
    padding: 12px;
    font-size: 1.1rem;
    padding-right: 40px;
  }
  .input-icon {
    font-size: 1.3rem;
    right: 15px;
  }
  .filter-btn {
    padding: 8px 15px;
    font-size: 1rem;
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
  .event-actions {
    padding-top: 15px;
    gap: 10px;
  }
  .remove-favorite-btn, .action-button {
    font-size: 1rem;
    padding: 10px 18px;
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
  .filters-section {
    margin-bottom: 25px;
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
  .remove-favorite-btn, .action-button {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>