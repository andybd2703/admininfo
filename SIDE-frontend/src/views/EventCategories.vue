<template>
  <div class="events-page-wrapper">
    <div class="events-main-box">
      <h1 class="page-title">🎉 Próximos Eventos</h1>

      <div class="filters-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar eventos por nombre, categoría..."
          class="search-input"
        />
        <div class="category-filters">
          <button
            class="filter-btn"
            :class="{ active: activeCategory === 'all' }"
            @click="filterByCategory('all')"
          >
            Todos
          </button>
          <button
            class="filter-btn"
            :class="{ active: activeCategory === 'música' }"
            @click="filterByCategory('música')"
          >
            Música
          </button>
          <button
            class="filter-btn"
            :class="{ active: activeCategory === 'deportes' }"
            @click="filterByCategory('deportes')"
          >
            Deportes
          </button>
          <button
            class="filter-btn"
            :class="{ active: activeCategory === 'arte' }"
            @click="filterByCategory('arte')"
          >
            Arte
          </button>
          </div>
      </div>

      <div v-if="loading" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Cargando eventos...
      </div>

      <div v-else-if="eventosFiltrados.length === 0" class="empty-state-message">
        <p>No se encontraron eventos con los criterios de búsqueda o filtro seleccionados. 😔</p>
        <button class="action-button" @click="resetFilters">Restablecer filtros</button>
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

              <p class="event-detail">
                <i class="fas fa-tags"></i> Categoría: {{ evento.categoria }}
              </p>

              <div class="event-actions">
                <button @click.prevent="$router.push(`/detalle-evento/${evento.id}`)" class="action-button">
                  Ver Detalles
                </button>
                <button
                  @click.prevent="toggleFavorite(evento.id)"
                  :class="['favorite-button', { 'is-favorite': isFavorite(evento.id) }]"
                >
                  <i :class="['fas', isFavorite(evento.id) ? 'fa-heart' : 'fa-heart']"></i>
                  {{ isFavorite(evento.id) ? 'En favoritos' : 'Añadir a favoritos' }}
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
  name: 'EventsCategories',
  data() {
    return {
      eventos: [],
      loading: true,
      searchQuery: '',
      activeCategory: 'all', // Para los filtros de categoría
      favoriteEvents: [], // Para almacenar los IDs de eventos favoritos del usuario
      userId: localStorage.getItem('userId') // Asume que tienes el userId en localStorage
    };
  },
  computed: {
    eventosFiltrados() {
      let filtered = this.eventos;

      // Filtrar por categoría
      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(evento =>
          evento.categoria.toLowerCase() === this.activeCategory.toLowerCase()
        );
      }

      // Filtrar por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          evento =>
            evento.nombre.toLowerCase().includes(query) ||
            evento.categoria.toLowerCase().includes(query)
        );
      }
      return filtered;
    }
  },
  methods: {
    async fetchEventos() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/events');
        this.eventos = response.data;
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchFavoriteEvents() {
        if (!this.userId) return;
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/api/favoritos/${this.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.favoriteEvents = response.data.map(fav => fav.id); // Asume que la respuesta es un array de objetos con 'id'
        } catch (error) {
            console.error('Error al obtener eventos favoritos:', error);
            this.favoriteEvents = [];
        }
    },
    async toggleFavorite(eventoId) {
        if (!this.userId) {
            alert('Debes iniciar sesión para añadir a favoritos.');
            this.$router.push('/login'); // O la ruta de tu login
            return;
        }

        const isCurrentlyFavorite = this.isFavorite(eventoId);
        const token = localStorage.getItem('token');

        try {
            if (isCurrentlyFavorite) {
                // Eliminar de favoritos
                await axios.delete(`http://localhost:3000/api/favoritos/remove/${this.userId}/${eventoId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.favoriteEvents = this.favoriteEvents.filter(id => id !== eventoId);
            } else {
                // Añadir a favoritos
                await axios.post(`http://localhost:3000/api/favoritos/add`,
                    { usuario_id: this.userId, evento_id: eventoId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.favoriteEvents.push(eventoId);
            }
        } catch (error) {
            console.error('Error al actualizar favoritos:', error);
            alert('Hubo un error al actualizar tus favoritos.');
        }
    },
    isFavorite(eventoId) {
        return this.favoriteEvents.includes(eventoId);
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
    filterByCategory(category) {
      this.activeCategory = category;
    },
    resetFilters() {
      this.searchQuery = '';
      this.activeCategory = 'all';
    }
  },
  mounted() {
    this.fetchEventos();
    this.fetchFavoriteEvents(); // Carga los favoritos del usuario al iniciar
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

/* Sección de filtros */
.filters-section {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espacio entre elementos */
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0; /* Separador sutil */
  align-items: center; /* Centra los elementos horizontalmente */
}

.search-input {
  width: 100%;
  max-width: 500px; /* Ancho máximo para el input de búsqueda */
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1.1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #173788;
  outline: none;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 15px; /* Espacio entre la barra de búsqueda y los botones */
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

/* Botón general de acción (ej. "Restablecer filtros") */
.action-button {
  display: inline-block;
  background-color: #173788; /* Color principal */
  color: white;
  padding: 15px 30px;
  border: none; /* Asegura que no haya borde extra */
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.2rem;
  margin-top: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: bold;
  cursor: pointer; /* Añade cursor de puntero */
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

.event-actions {
  margin-top: auto; /* Empuja los botones hacia abajo en la tarjeta */
  padding-top: 20px;
  border-top: 1px solid #eee; /* Separador para los botones */
  display: flex;
  flex-direction: column; /* Apila los botones */
  gap: 15px; /* Espacio entre botones */
}

/* Botón de favoritos */
.favorite-button {
  background-color: #173788; /* Color principal */
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-weight: bold;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-button i {
  margin-right: 8px;
}

.favorite-button:hover {
  background-color: #0056b3; /* Un azul más oscuro */
}

.favorite-button.is-favorite {
  background-color: #e74c3c; /* Un rojo para indicar que ya es favorito */
}

.favorite-button.is-favorite:hover {
  background-color: #c0392b; /* Rojo más oscuro al hover */
}


/* Media Queries para responsividad */
@media (max-width: 992px) {
  .events-main-box {
    padding: 40px;
  }
  .page-title {
    font-size: 2.4rem;
  }
  .search-input {
    max-width: 400px;
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
  .search-input {
    width: 90%;
    max-width: none;
  }
  .category-filters {
    gap: 10px;
  }
  .filter-btn {
    font-size: 1rem;
    padding: 8px 15px;
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
  .action-button, .favorite-button {
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
  .action-button, .favorite-button {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>