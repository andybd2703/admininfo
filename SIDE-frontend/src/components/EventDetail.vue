<template>
    <div class="container mt-5">
      <div v-if="evento" class="evento-detalle">
        <h2 class="text-center evento-titulo">{{ evento.titulo }}</h2>
        <div class="evento-contenido">
          <img :src="evento.imagen" class="evento-imagen img-fluid rounded" alt="Imagen evento">
          <div class="evento-info">
            <p class="descripcion">{{ evento.descripcion }}</p>
            <p><i class="bi bi-geo-alt-fill"></i> <strong>Lugar:</strong> {{ evento.lugar }}</p>
            <p><i class="bi bi-calendar-event"></i> <strong>Fecha:</strong> {{ evento.fecha }}</p>
            <p><i class="bi bi-clock"></i> <strong>Hora:</strong> {{ evento.hora }}</p>
            <p><i class="bi bi-music-note-list"></i> <strong>Artistas Invitados:</strong> {{ evento.artistas }}</p>
            <p><i class="bi bi-cash-stack"></i> <strong>Entradas:</strong> {{ evento.entradas }}</p>
            <p><i class="bi bi-info-circle-fill"></i> <strong>Requisitos:</strong> {{ evento.requisitos }}</p>
            <div class="botones">
              <router-link to="/" class="btn btn-secondary">Volver</router-link>
              <a :href="evento.linkCompra" class="btn btn-success" target="_blank">Comprar Entradas</a>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <p>Cargando detalles del evento...</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        evento: null,
        eventos: [
          {
            id: "1",
            titulo: "Fiesta de Reguetón Explosiva",
            descripcion: "Una noche llena de reguetón con los mejores éxitos y DJs internacionales.",
            lugar: "Bloque #1, USC - Salón Principal",
            fecha: "Viernes 12 de Abril",
            hora: "8:00 PM - 2:00 AM",
            artistas: "J Balvin, Karol G, Rauw Alejandro",
            entradas: "General: $50.000 | VIP: $120.000 | Platino: $200.000",
            requisitos: "Mayores de 18 años, vestimenta casual-elegante",
            linkCompra: "https://compraentradas.com/reggaeton",
            imagen: "https://elmundo.cr/wp-content/uploads/2022/10/regueton.jpg.webp"
          },
          {
            id: "2",
            titulo: "Noche Electrónica Ultra",
            descripcion: "La mejor experiencia electrónica con luces, pantallas LED y beats intensos.",
            lugar: "Bloque #3, USC - Terraza Panorámica",
            fecha: "Sábado 20 de Abril",
            hora: "9:00 PM - 3:00 AM",
            artistas: "David Guetta, Tiësto, Martin Garrix",
            entradas: "General: $80.000 | VIP: $150.000 | Ultra: $250.000",
            requisitos: "Acceso para mayores de 18 años con documento de identidad",
            linkCompra: "https://compraentradas.com/electronica",
            imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy-RbcV0m-LhkBLKAHsqUR-DaTZZ7DHMmPMA&s"
          }
        ]
      };
    },
    created() {
      const eventId = this.$route.params.id;
      this.evento = this.eventos.find(e => e.id === eventId);
      if (!this.evento) {
        console.error("Evento no encontrado.");
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
  }
  
  .evento-detalle {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
    margin: auto;
  }
  
  .evento-titulo {
    font-size: 28px;
    font-weight: bold;
    color: #343a40;
  }
  
  .evento-contenido {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .evento-imagen {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0px 4px 8px rgba(239, 234, 234, 0.2);
  }
  
  .evento-info p {
    font-size: 18px;
    margin: 8px 0;
    color: #495057;
  }
  
  .descripcion {
    font-size: 20px;
    font-weight: bold;
    color: #212529;
    margin-bottom: 20px;
  }
  
  .botones {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
  
  .btn {
    font-size: 16px;
    padding: 10px 20px;
    border-radius: 8px;
  }
  
  .btn-success {
    background-color: #28a745;
    border: none;
  }
  
  .btn-success:hover {
    background-color: #218838;
  }
  </style>
  