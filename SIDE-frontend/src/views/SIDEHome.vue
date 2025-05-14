<template>
  <div class="page-container">
    <div class="banner-container">
      <img src="https://i.imgur.com/aFz9w6I.jpeg" alt="Banner Queen" class="banner-image">
    </div>

    <div class="event-section">
      <h2 class="section-title">Bienvenido a <strong>SIDE TEAM</strong> </h2>
      <p class="section-subtitle">Explora nuestros eventos y encuentra el que más te gusta:</p>

      <div class="row justify-content-center">
        <div v-for="evento in eventos" :key="evento.id" class="col-md-6 col-lg-3 mb-4">
          <div class="card event-card">
            <router-link :to="`/detalle-evento/${evento.id}`" class="image-container">
              <img :src="evento.imagen" class="card-img-top event-image" alt="Imagen evento">
              <div class="overlay">
                <p class="event-title">{{ evento.titulo }}</p>
                <p class="event-description">{{ evento.descripcion }}</p>
              </div>
              <p class="event-date">{{ evento.fecha }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <footer class="main-footer">
      <div class="footer-columns">
        <div class="footer-column">
          <h3>SIDE USC</h3>
          <ul>
            <li>Servicios Integrales de Eventos</li>
            <li>Número de contacto:</li>
            <li>+57 3207256230</li>
          </ul>
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
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink
  },
  data() {
    return {
      eventos: [
        {
          id: 1,
          titulo: "Conferencia Deportiva",
          descripcion: "Charlas inspiradoras con deportistas destacados sobre cómo el deporte transforma vidas.",
          imagen: "https://i.imgur.com/mHVZY2p.jpeg",
          fecha: "Lunes 10 de Junio"
        },
        {
          id: 2,
          titulo: "Taller de Nutrición Deportiva",
          descripcion: "Aprende a llevar una alimentación adecuada para mejorar tu rendimiento físico.",
          imagen: "https://i.imgur.com/89imktm.jpeg",
          fecha: "Martes 11 de Junio"
        },
        {
          id: 3,
          titulo: "Exhibición de Deporte Universitario",
          descripcion: "Presentación de equipos deportivos representativos de la universidad.",
          imagen: "https://i.imgur.com/al5UI2l.jpeg",
          fecha: "Miércoles 12 de Junio"
        },
        {
          id: 4,
          titulo: "Feria Deportiva y Recreativa",
          descripcion: "Actividades lúdicas, juegos y deportes para toda la comunidad universitaria.",
          imagen: "https://i.imgur.com/CMFxHk2.jpeg",
          fecha: "Viernes 14 de Junio"
        }
      ],
    };
  },
};
</script>

<style scoped>
.page-container {
  font-family: 'Montserrat', sans-serif;
  background-color: #f8f9fa;
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

/* Tarjeta de evento */
.event-card {
  position: relative;
  width: 280px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.3s ease-in-out;
}

.event-card:hover {
  transform: scale(1.05);
}

/* Imagen del evento con overlay */
.image-container {
  position: relative;
  display: block;
}

.event-image {
  width: 100%;
  display: block;
}

/* Sombreado negro con información del evento */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.image-container:hover .overlay {
  opacity: 1;
}

.event-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.event-description {
  font-size: 0.9rem;
  max-width: 80%;
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