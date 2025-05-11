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
          <button class="buy-tickets-button">Comprar Entradas</button>
          <div class="quick-info">
            <div class="info-item">
              <p class="info-text"> Arena USC </p>
            </div>
            <div class="info-item">
              <p class="info-text">{{ formattedFecha }}</p>
            </div>
            <div class="info-item">
              <p class="info-text">{{ evento.hora }}</p>
            </div>
            <div class="info-item">
              <p class="info-text">{{ evento.edad_minima }} años</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <div class="details-container">
        <div class="event-details">
          <h2 class="section-title">{{ evento.lugar }}</h2>
          <p class="event-date-detail">{{ formattedFecha }} a las {{ evento.hora }}</p>

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
import { format } from 'date-fns'; // Importamos la librería
import { es } from 'date-fns/locale';

export default {
  data() {
    return {
      evento: {} // Aquí almacenamos los datos del evento
    };
  },
  computed: {
    // Computada para formatear la fecha
    formattedFecha() {
      return this.evento.fecha ? format(new Date(this.evento.fecha), 'dd MMMM yyyy', { locale: es }) : ''; 
    }
  },
  created() {
    const eventoId = this.$route.params.id; // Suponiendo que el ID del evento es parte de la URL
    this.obtenerEvento(eventoId);
  },
  methods: {
    async obtenerEvento(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${id}`); // Aquí haces la solicitud a tu API
        this.evento = response.data;
        console.log("🎯 Evento cargado:", this.evento);
      } catch (error) {
        console.error("❌ Error al obtener el evento:", error);
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
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  align-items: center;
}

.top-section {
  background-size: cover;
  background-position: center top;
  padding: 25px 15px; /* Reducido */
  display: flex;
  justify-content: center;
  width: 100%;
}

.event-card {
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 720px; /* Tamaño reducido */
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
}

.event-image {
  width: 100%; /* Imagen a tamaño completo */
  border-radius: 8px;
  margin-bottom: 12px; /* Reducido */
}

.event-image img {
  width: 100%;
  display: block;
}

.event-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.buy-tickets-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem; /* Tamaño reducido */
  transition: background-color 0.3s ease;
}

.buy-tickets-button:hover {
  background-color: #0056b3;
}

.event-description {
  color: #333;
  font-size: 0.9rem; /* Más pequeño */
  line-height: 1.5;
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: center;
  width: 85%;
}

.quick-info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 15px; /* Reducido */
  width: 85%;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 5px 10px;
}

.info-icon {
  width: 20px; /* Más pequeño */
  height: 20px;
  margin-right: 6px; /* Menos margen */
}

.info-text {
  color: #555;
  font-size: 0.85rem; /* Menor tamaño de fuente */
}

/* Estilos sección inferior */
.bottom-section {
  background-color: #f9f9f9;
  padding: 20px 15px; /* Reducido */
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
  gap: 15px; /* Más pequeño */
}

.event-details {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
}

.section-title {
  color: #333;
  font-size: 1.5rem; /* Más pequeño */
  margin-bottom: 10px;
  border-bottom: 2px solid #eee;
  padding-bottom: 8px;
  text-align: center;
}

.event-date-detail {
  color: #777;
  font-size: 0.85rem; /* Reducido */
  margin-bottom: 10px;
  text-align: center;
}

.subsection-title {
  color: #555;
  font-size: 1rem; /* Reducido */
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
  border: 1px solid #ddd;
  padding: 6px;
  text-align: left;
}

.prices-table th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: center;
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
  color: #333;
}

.answer {
  color: #555;
}

.venue-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.map-preview, .seats-preview {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  box-sizing: border-box;
  text-align: center;
  width: 100%;
}

.map-title, .seats-title {
  color: #555;
  font-size: 1rem; /* Reducido */
  margin-bottom: 8px;
}

.map-preview img, .seats-preview img {
  max-width: 100%;
  border-radius: 5px;
  display: block;
  margin: 0 auto;
}

.final-message {
  text-align: center;
  padding: 15px;
  color: #666;
  font-style: italic;
  margin-top: 20px;
  max-width: 720px;
  width: 100%;
}
</style>
