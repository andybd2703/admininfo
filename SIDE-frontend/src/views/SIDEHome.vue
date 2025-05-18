<template>
  <div class="page-container">
    <div class="banner-container">
      <img src="https://i.imgur.com/aFz9w6I.jpeg" alt="Banner Queen" class="banner-image">
    </div>

    <div class="event-section">
      <h2 class="section-title">Bienvenido a <strong>SIDE TEAM</strong> </h2>
      <p class="section-subtitle">Explora nuestros eventos y encuentra el que más te gusta:</p>

      <div class="events-grid">
  <div v-for="evento in eventos" :key="evento.id" class="event-card-link">
    <div class="card event-card">
      <router-link :to="`/detalle-evento/${evento.id}`" class="image-container">
        <img :src="getImageUrl(evento.imagen)" class="card-img-top event-image" alt="Imagen evento">
        <div class="overlay">
          <p class="event-title">{{ evento.titulo }}</p>
          <p class="event-description">{{ evento.descripcion }}</p>
        </div>
        <p class="event-date">{{ formatearFecha(evento.fecha) }}</p>

      </router-link>
    </div>
  </div>
</div>

    </div>

    <footer class="main-footer">
      <div class="footer-columns">
        <div class="footer-column">
          <h3>SIDE USC</h3>
        </div>
        <div class="footer-column">
          <h3>Categorías</h3>
          <ul>
            <li>Conciertos</li>
            <li>Deportes</li>
            <li>Culturales</li>
            <li>Académicos</li>
            <li>Empresariales</li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Ayuda</h3>
          <ul>
            <li>Contáctanos</li>
            <li>Información de eventos</li>
            <li>Lugares y horarios</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>Legal</h3>
          <ul>
            <li>Política de privacidad</li>
            <li>Términos y condiciones</li>
            <li>Protección de datos</li>
            <li>SIC</li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
  <a
  href="https://wa.me/573205063020"
  target="_blank"
  class="whatsapp-float"
  aria-label="Chat en WhatsApp"
>
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
    alt="WhatsApp"
    class="whatsapp-icon"
  />
</a>

</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      eventos: []
    };
  },
  methods: {
    getImageUrl(nombreArchivo) {
      return nombreArchivo ? `http://localhost:3000/uploads/${nombreArchivo}` : '';
    },
    formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }
  },
  mounted() {
    fetch('http://localhost:3000/api/events')
      .then(response => response.json())
      .then(data => {
        this.eventos = data;
      })
      .catch(error => {
        console.error('Error al cargar eventos:', error);
      });
  }
};
</script>

<style scoped>

.events-grid {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 2rem 1rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  justify-content: flex-start; /* Alinear al inicio */
  /* ❌ flex-wrap: wrap;  Quitar esta línea */
}
.page-container {
  font-family: 'Montserrat', sans-serif;
  background-color: #f8f9fa;
}

.whatsapp-float {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}

.whatsapp-icon {
  width: 35px;
  height: 35px;
}


/* Estilos del Banner */
.banner-container {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
}

.banner-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Sección de eventos */
.event-section {
  padding: 20px;
  text-align: center;
}

.section-title {
  font-size: 2rem;
  color: #173788;
}

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* --------------------------------------------- */
/* CARD e IMAGEN ocupan TODO el alto de la card  */
/* --------------------------------------------- */
.event-card {
  position: relative;
  width: 320px; /* fijo para mantener tamaño uniforme */
  height: 400px; /* altura fija */
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease-in-out;
  display: block; /* para contener la imagen */
}

.event-card:hover {
  transform: scale(1.05);
}

.image-container {
  position: relative;
  height: 100%; /* llena toda la altura de la card */
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;      /* ocupa todo el alto de su contenedor */
  object-fit: cover; /* para que rellene sin deformar */
  object-position: center;
  display: block;
}

/* Overlay para texto encima de la imagen */
.overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 1.2rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  border-radius: 8px;
}

.image-container:hover .overlay {
  opacity: 1;
}

/* Texto sobre la card */
.event-title {
  font-size: 1.4rem;
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-description {
  font-size: 1rem;
  max-width: 90%;
  color: white;
}

/* Fecha del evento */
.event-date {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #173788;
  color: #fff;
  padding: 5px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
}

.event-card-link {
  scroll-snap-align: start;
}

/* Footer */
.main-footer {
  background-color: #173788;
  color: #fff;
  padding: 30px;
}

.footer-columns {
  display: flex;
  justify-content: space-around;
}

.footer-column h3 {
  font-size: 1.2rem;
}

</style>