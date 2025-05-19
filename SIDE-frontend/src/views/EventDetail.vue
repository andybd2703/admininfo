<template>
  <div class="event-detail-container">
    <div class="top-section">
      <div class="event-card">
        <div class="event-image">
          <img :src="`http://localhost:3000/uploads/${evento.imagen}`">
        </div>
        <div class="event-info">
          <h1 class="section-title">{{ evento.nombre }}</h1>
          <p class="event-description">{{ evento.descripcion }}</p>
          <router-link :to="`/compra/${evento.id}`" class="buy-tickets-button">Comprar Entradas</router-link>

          
          
          <div class="quick-info">
            <div class="info-item">
            <div class="info-item">📍 Arena USC</div>
            </div>
            <div class="info-item">
            <div class="info-item">📅 {{ formattedFecha }}</div>
            </div>
            <div class="info-item">
            <div class="info-item">⏰ {{ formattedHora }}</div>
            </div>
            <div class="info-item">
            <div class="info-item">👶 {{ evento.edad_minima }} años</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="details-container">
        <div class="event-details">
          <h2 class="section-title">{{ evento.lugar }}</h2>
          <div class="locations-prices">
            <h3 class="subsection-title">Boletos y Precios</h3>
            <table class="prices-table">
              <thead>
                <tr>
                  <th>Boletos</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Platino</td>
                  <td>{{ evento.precio_platino_full }}</td>
                </tr>
                <tr>
                  <td>VIP</td>
                  <td>{{ evento.precio_vip_full }}</td>
                </tr>
                <tr>
                  <td>General</td>
                  <td>{{ evento.precio_general_full }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="frequent-questions">
            <h3 class="subsection-title">Preguntas Frecuentes</h3>
            <ul>
              <li>
                <strong class="question">¿Edad mínima?</strong>
                <span class="answer">{{ evento.edad_minima }} años</span>
              </li>
              <li>
                <strong class="question">¿Se venderá comida?</strong>
                <span class="answer">{{ evento.vender_comida ? 'Sí' : 'No' }}</span>
              </li>
              <li>
                <strong class="question">¿Se venderán bebidas alcohólicas?</strong>
                <span class="answer">{{ evento.vender_bebidas_alcoholicas ? 'Sí' : 'No' }}</span>
              </li>
              <li>
                <strong class="question">¿Apto para personas con movilidad reducida?</strong>
                <span class="answer">Sí, cuenta con espacios habilitados para personas con movilidad reducida.</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="venue-info">
          <div class="map-preview">
            <h3 class="map-title">Mapa de las sillas</h3>
            <img src="https://i.imgur.com/NF8QZZ6.jpeg" alt="Mapa Arena USC">
          </div>
          <div class="seats-preview">
            <h3 class="seats-title">Vista previa del ARENA USC</h3>
            <img src="https://i.imgur.com/SK3FE5g.jpeg" alt="Distribución de asientos Arena USC">
          </div>
        </div>
      </div>
    </div>
    <div class="final-message">
      <p>¡Una experiencia mágica te espera! No te lo pierdas.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  data() {
    return {
      evento: {},
      esFavorito: false, // nuevo estado
      carrito: []        // nuevo estado
    };
  },
  computed: {
    formattedFecha() {
      return this.evento.fecha
        ? format(new Date(this.evento.fecha), 'dd MMMM yyyy', { locale: es })
        : '';
    },
    formattedHora() {
      if (!this.evento.hora) return '';
      const [hora, minuto] = this.evento.hora.split(':');
      const date = new Date();
      date.setHours(parseInt(hora), parseInt(minuto));
      return format(date, 'hh:mm a', { locale: es });
    },
  },  // <-- Esta coma es importantísima para que no dé error
  created() {
    const eventoId = this.$route.params.id;
    this.obtenerEvento(eventoId);
    this.verificarFavorito(eventoId);
  },
  methods: {
    async obtenerEvento(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${id}`);
        this.evento = response.data;
        console.log(" Evento cargado:", this.evento);

        // 👇 Llamamos a verificarFavorito solo después de tener el evento
        this.verificarFavorito();
      } catch (error) {
        console.error(" Error al obtener el evento:", error);
      }
    },

    async toggleFavorito() {
      try {
        const usuarioId = localStorage.getItem('userId');
        const eventoId = this.evento.id;

        if (this.esFavorito) {
          await axios.delete('http://localhost:3000/api/favoritos/remove', {
            data: {
              usuario_id: usuarioId,
              evento_id: eventoId
            }
          });
        } else {
          await axios.post('http://localhost:3000/api/favoritos/add', {
            usuario_id: usuarioId,
            evento_id: eventoId
          });
        }
        this.esFavorito = !this.esFavorito; 
      } catch (error) {
        console.error(" Error al actualizar favorito:", error);
      }
    },

    async verificarFavorito() {
      try {
        const usuarioId = localStorage.getItem('userId');
        const eventoId = this.evento.id;
        const response = await axios.get(`http://localhost:3000/api/favoritos/verificar/${usuarioId}/${eventoId}`);
        this.esFavorito = response.data.isFavorito;
      } catch (error) {
        console.error(" Error al verificar si es favorito:", error);
      }
    },

    async agregarAlCarrito() {
      try {
        const usuarioId = localStorage.getItem('userId');
        if (!usuarioId) {
          alert('Debes iniciar sesión para agregar al carrito');
          return;
        }

        const payload = {
          usuario_id: usuarioId,
          evento_id: this.evento.id,
          cantidad: 1
        };

        const response = await axios.post('http://localhost:3000/api/carrito/add', payload);

        if (response.status === 200 || response.status === 201) {
          alert('¡Agregado al carrito correctamente!');
        } else {
          alert('No se pudo agregar al carrito, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error agregando al carrito:', error);
        alert('Ocurrió un error al agregar al carrito.');
      }
    }
  }
};
</script>



<style scoped>
/* Estilos generales */
.event-detail-container {
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e6ecf5;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
}

.top-section {
  background-size: cover;
  background-position: center top;
  padding: 25px 15px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.event-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 720px;
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
}

.event-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  display: block;
  border-radius: 8px;
  object-fit: cover;
}

.event-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.section-title {
  color: #002b80;
  font-size: 1.5rem;
  margin-bottom: 10px;
  border-bottom: 2px solid #dbe2ef;
  padding-bottom: 8px;
  text-align: center;
}

.event-description {
  color: #333;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: center;
  width: 85%;
}

.buy-tickets-button,
.cart-button,
.favorites-button {
  background-color: #002b80;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
  margin: 5px;
  text-decoration: none;
}

.buy-tickets-button:hover,
.cart-button:hover,
.favorites-button:hover {
  background-color: #001f5c;
}

.quick-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 15px;
  width: 85%;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 5px 10px;
}

.info-text {
  color: #002b80;
  font-weight: bold;
  font-size: 0.9rem;
}

/* Sección inferior */
.bottom-section {
  background-color: #f0f4fa;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.details-container {
  max-width: 720px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.event-details {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
}

.event-date-detail {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 10px;
  text-align: center;
}

.subsection-title {
  color: #002b80;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 15px;
  margin-bottom: 8px;
  text-align: center;
}

.prices-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.prices-table th, .prices-table td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: center;
}

.prices-table th {
  background-color: #002b80;
  color: white;
}

.prices-table td {
  background-color: #f8f9fc;
  color: #333;
}

.frequent-questions {
  width: 100%;
}

.frequent-questions ul {
  list-style: none;
  padding: 0;
}

.frequent-questions li {
  margin-bottom: 12px;
}

.question {
  font-weight: bold;
  color: #002b80;
}

.answer {
  color: #444;
}

.venue-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.map-preview,
.seats-preview {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
}

.map-title,
.seats-title {
  color: #002b80;
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.map-preview img,
.seats-preview img {
  max-width: 100%;
  border-radius: 5px;
  display: block;
  margin: 0 auto;
  object-fit: cover;
}

.final-message {
  text-align: center;
  padding: 15px;
  color: #003366;
  font-style: italic;
  margin-top: 20px;
  max-width: 720px;
  width: 100%;
}

.extra-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

