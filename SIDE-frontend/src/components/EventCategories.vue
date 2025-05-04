<template>
  <div class="background">
    <div class="container text-center">
      <h2>Bienvenido a <strong>SIDE TEAM</strong> 🎉</h2>
      <p>Explora nuestros eventos y encuentra el que más te gusta:</p>

      <div class="row justify-content-center">
        <div v-for="evento in eventos" :key="evento.id" class="col-md-5 col-lg-3 mb-4">
          <div class="card shadow-lg">
            <img :src="evento.imagen" class="card-img-top" alt="Imagen evento">
            <div class="card-body">
              <h5 class="card-title">{{ evento.titulo }}</h5>
              <p class="card-text">{{ evento.descripcion }}</p>
              <p><strong>Lugar:</strong> {{ evento.lugar }}</p>
              <p><strong>Hora:</strong> {{ evento.hora }}</p>
              <router-link :to="`/evento/${evento.id}`" class="btn btn-primary">Ver detalles</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      eventos: [
        { id: 1, titulo: "Fiesta de Reguetón", descripcion: "Disfruta de los mejores éxitos del reguetón con DJs en vivo.", lugar: "Bloque #1, USC", hora: "8:00 PM - 2:00 AM", imagen: "https://www.rollingstone.com/wp-content/uploads/2022/08/220622_reggaeton_songs_final.jpg?w=1600&h=900&crop=1" },
        { id: 2, titulo: "Noche Electrónica", descripcion: "Un evento con los mejores beats de música electrónica.", lugar: "Bloque #3, USC", hora: "9:00 PM - 3:00 AM", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-DdoB6c9O-EY_Z9vYIDV2amkg5SUgRlU-og&s" },
        { id: 3, titulo: "Rumba Salsera", descripcion: "Baila y disfruta al ritmo de la mejor salsa en vivo.", lugar: "Bloque #2, USC", hora: "7:00 PM - 12:00 AM", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW-42pcFnh94TUN4BmdeSK-dDpj5IFQvIltw&s" },
        { id: 4, titulo: "Eventos Variados", descripcion: "Descubre otras experiencias musicales en USC.", lugar: "Bloque #4, USC", hora: "6:00 PM - 11:00 PM", imagen: "https://images.pexels.com/photos/167473/pexels-photo-167473.jpeg" },
      ],
    };
  },
};
</script>

<style scoped>
/* Fondo de toda la página */
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://www.elpais.com.co/especiales/educacion-superior/assets/img/u/usc-2-1.jpg'); /* Usa una imagen HD */
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Contenedor principal */
.container {
  width: 90%;
  max-width: 1200px;
  background: rgba(0, 0, 0, 0.8); /* Fondo oscuro con opacidad */
  padding: 30px;
  border-radius: 10px;
  color: white;
  text-align: center;
}

/* Texto con sombra */
h2, p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

/* Diseño de las tarjetas */
.card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  background: rgba(255, 255, 255, 0.9);
}

.card:hover {
  transform: scale(1.05);
}

/* Ajuste de imágenes */
.card-img-top {
  width: 100%;
  height: 180px;
  object-fit: cover;
  filter: brightness(1.1); /* Mejora la visibilidad */
}

/* Botones */
.btn-primary {
  background-color: #173788;
  border: none;
}

.btn-primary:hover {
  background-color: #e60073;
}

/* Responsividad */
@media (max-width: 768px) {
  .container {
    width: 95%;
    padding: 20px;
  }

  .card-img-top {
    height: 160px;
  }
}
</style>
