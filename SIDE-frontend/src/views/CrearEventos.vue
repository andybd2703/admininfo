<template>
  <div class="form-page-wrapper">
    <div class="form-main-box">
      <h2 class="form-title">Crear un Nuevo Evento ✨</h2>
      <form @submit.prevent="submitEvent" class="event-form">

        <div class="form-group">
          <label for="name"><i class="fas fa-signature"></i> Nombre del Evento:</label>
          <input type="text" id="name" v-model="event.name" required />
        </div>

        <div class="form-group">
          <label for="description"><i class="fas fa-align-left"></i> Descripción:</label>
          <textarea id="description" v-model="event.description" required></textarea>
        </div>

        <div class="form-group">
          <label for="image"><i class="fas fa-image"></i> Imagen del Evento:</label>
          <input type="file" id="image" @change="handleImageUpload" required />
        </div>

        <div class="form-group">
          <label for="category"><i class="fas fa-tags"></i> Categoría del Evento:</label>
          <select id="category" v-model="event.category" required>
            <option disabled value="">Selecciona una categoría</option>
            <option value="musica">Música</option>
            <option value="arte">Arte</option>
            <option value="entretenimiento">Entretenimiento</option>
            <option value="teatro">Teatro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="date"><i class="fas fa-calendar-alt"></i> Fecha:</label>
          <input type="date" id="date" v-model="event.date" :min="today" required />
        </div>

        <div class="form-group">
          <label for="time"><i class="fas fa-clock"></i> Hora:</label>
          <input type="time" id="time" v-model="event.time" required />
        </div>

        <div class="form-group">
          <label for="place"><i class="fas fa-map-marker-alt"></i> Lugar:</label>
          <input type="text" id="place" v-model="event.place" readonly />
        </div>

        <div class="form-group">
          <label for="age_limit"><i class="fas fa-user-friends"></i> Edad Mínima:</label>
          <input type="number" id="age_limit" v-model="event.age_limit" required min="0" />
        </div>

        <div class="form-group">
          <label for="ticket_platino_full_price"><i class="fas fa-ticket-alt"></i> Precio Platino:</label>
          <input type="text" id="ticket_platino_full_price" v-model="event.tickets.platino.full_price" required />
        </div>

        <div class="form-group">
          <label for="ticket_vip_full_price"><i class="fas fa-ticket-alt"></i> Precio VIP:</label>
          <input type="text" id="ticket_vip_full_price" v-model="event.tickets.vip.full_price" required />
        </div>

        <div class="form-group">
          <label for="ticket_general_full_price"><i class="fas fa-ticket-alt"></i> Precio General:</label>
          <input type="text" id="ticket_general_full_price" v-model="event.tickets.general.full_price" required />
        </div>

        <div class="form-group">
          <label for="faq_1"><i class="fas fa-utensils"></i> Pregunta 1: ¿Se venderá comida?</label>
          <select v-model="event.faq[0].answer" required>
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </div>

        <div class="form-group">
          <label for="faq_2"><i class="fas fa-wine-glass-alt"></i> Pregunta 2: ¿Se venderán bebidas alcohólicas?</label>
          <select v-model="event.faq[1].answer" required>
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </div>

        <button type="submit" class="submit-button">
          <i class="fas fa-paper-plane"></i> Crear Evento
        </button>

        <div v-if="errorMessage" class="error-message">
          <i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      event: {
        name: '',
        description: '',
        image: null,
        date: '',
        time: '',
        place: 'Arena USC, Cali, Colombia',
        age_limit: 0,
        category: '',
        tickets: {
          platino: { full_price: '', discount_price: '' },
          vip: { full_price: '', discount_price: '' },
          general: { full_price: '', discount_price: '' }
        },
        faq: [
          { question: '¿Se venderá comida?', answer: false },
          { question: '¿Se venderán bebidas alcohólicas?', answer: false }
        ]
      },
      errorMessage: '',
      today: new Date().toISOString().split("T")[0]
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.event.image = file;
      }
    },
    async submitEvent() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(this.event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (eventDate <= today) {
        this.errorMessage = 'La fecha del evento debe ser posterior al día de hoy.';
        return;
      }

      try {
        const formData = new FormData();
        const usuario_id = localStorage.getItem('userId');
        formData.append('nombre', this.event.name);
        formData.append('descripcion', this.event.description);
        formData.append('fecha', this.event.date);
        formData.append('hora', this.event.time);
        formData.append('lugar', this.event.place);
        formData.append('edad_minima', this.event.age_limit);
        formData.append('precio_platino_full', this.event.tickets.platino.full_price);
        formData.append('precio_vip_full', this.event.tickets.vip.full_price);
        formData.append('precio_general_full', this.event.tickets.general.full_price);
        formData.append('vender_comida', this.event.faq[0].answer ? 1 : 0);
        formData.append('vender_bebidas_alcoholicas', this.event.faq[1].answer ? 1 : 0);
        formData.append('usuario_id', usuario_id);
        formData.append('categoria', this.event.category);

        if (this.event.image) {
          formData.append('imagen', this.event.image);
        }

        const token = localStorage.getItem('token');
        const config = token
          ? { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
          : { headers: { 'Content-Type': 'multipart/form-data' } };

        const response = await axios.post('http://localhost:3000/api/events/crear', formData, config);

        console.log('Evento creado correctamente', response.data);
        this.errorMessage = '';
        alert('¡Evento creado con éxito!');
        this.$router.push('/eventos');
      } catch (error) {
        console.error('Error al crear el evento', error);
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = `Error al crear el evento: ${error.response.data.error}`;
        } else {
          this.errorMessage = 'Hubo un problema al crear el evento. Intenta nuevamente más tarde.';
        }
      }
    }
  }
};
</script>

<style scoped>

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.form-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; 
  min-height: 100vh; 
  padding: 40px 20px; 
  background-color: #f0f2f5; 
  box-sizing: border-box;
}

.form-main-box {
  background-color: rgba(255, 255, 255, 0.95); 
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
  width: 100%;
  max-width: 700px; /* Ancho máximo para el formulario */
  box-sizing: border-box;
}

/* Título del formulario */
.form-title {
  text-align: center;
  color: #173788; /* Color principal */
  margin-bottom: 40px;
  font-size: 2.5rem; /* Un poco más grande */
  font-weight: bold;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacio entre grupos de formulario */
}

.form-group {
  margin-bottom: 0; /* Reinicia el margin-bottom predeterminado */
}

label {
  font-weight: bold;
  display: flex; /* Para alinear ícono y texto */
  align-items: center;
  margin-bottom: 8px; /* Espacio debajo de la etiqueta */
  color: #333; /* Color de texto más oscuro */
  font-size: 1.1rem;
}

label i {
  margin-right: 10px; /* Espacio entre ícono y texto de la etiqueta */
  color: #173788; /* Color para los íconos de las etiquetas */
  font-size: 1.3rem;
}

input[type="text"],
input[type="number"],
input[type="date"],
input[type="time"],
textarea,
select {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Incluye padding y border en el ancho */
}

input:focus,
textarea:focus,
select:focus {
  border-color: #173788;
  box-shadow: 0 0 0 3px rgba(23, 55, 136, 0.2); /* Sombra de enfoque azul */
  outline: none; /* Eliminar el contorno predeterminado del navegador */
}

textarea {
  resize: vertical; /* Permite redimensionar verticalmente */
  min-height: 100px;
}

/* Estilo para el input[type="file"] para que sea coherente */
input[type="file"] {
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  padding: 10px; /* Un poco más de padding para que se vea bien */
}


.submit-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #173788; /* Color principal */
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px; /* Espacio por encima del botón */
}

.submit-button i {
  margin-right: 10px;
  font-size: 1.3rem;
}

.submit-button:hover {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
  transform: translateY(-2px);
}

.error-message {
  color: #dc3545; /* Rojo de error */
  margin-top: 20px;
  text-align: center;
  font-weight: bold;
  background-color: #ffe0e0; /* Fondo suave para el mensaje de error */
  border: 1px solid #dc3545;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message i {
  margin-right: 10px;
}

/* Media Queries para responsividad */
@media (max-width: 992px) {
  .form-main-box {
    padding: 40px;
  }
  .form-title {
    font-size: 2.2rem;
  }
  label {
    font-size: 1rem;
  }
  input, textarea, select {
    padding: 10px 12px;
  }
  .submit-button {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
}

@media (max-width: 768px) {
  .form-page-wrapper {
    padding: 20px 15px;
  }
  .form-main-box {
    padding: 30px;
  }
  .form-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  .event-form {
    gap: 15px;
  }
  label {
    font-size: 0.95rem;
  }
  label i {
    font-size: 1.2rem;
  }
  input, textarea, select {
    padding: 9px 10px;
    font-size: 0.95rem;
  }
  .submit-button {
    font-size: 1rem;
    padding: 10px 20px;
  }
  .error-message {
    padding: 12px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .form-main-box {
    padding: 20px;
  }
  .form-title {
    font-size: 1.7rem;
    margin-bottom: 25px;
  }
  .event-form {
    gap: 12px;
  }
  label {
    font-size: 0.9rem;
  }
  label i {
    font-size: 1.1rem;
  }
  input, textarea, select {
    padding: 8px;
    font-size: 0.9rem;
  }
  .submit-button {
    font-size: 0.95rem;
    padding: 10px 18px;
  }
  .error-message {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>