<template>
  <div class="create-event-form">
    <h2>Crear un nuevo evento</h2>
    <form @submit.prevent="submitEvent">
      
      <div class="form-group">
        <label for="name">Nombre del Evento:</label>
        <input type="text" id="name" v-model="event.name" required />
      </div>

      <div class="form-group">
        <label for="description">Descripción:</label>
        <textarea id="description" v-model="event.description" required></textarea>
      </div>

      <div class="form-group">
        <label for="image">Imagen del Evento:</label>
        <input type="file" id="image" @change="handleImageUpload" required />
      </div>

      <div class="form-group">
        <label for="date">Fecha:</label>
        <input type="date" id="date" v-model="event.date" required />
      </div>

      <div class="form-group">
        <label for="time">Hora:</label>
        <input type="time" id="time" v-model="event.time" required />
      </div>

      <div class="form-group">
        <label for="place">Lugar:</label>
        <input type="text" id="place" v-model="event.place" required />
      </div>

      <div class="form-group">
        <label for="age_limit">Edad Mínima:</label>
        <input type="number" id="age_limit" v-model="event.age_limit" required min="0" />
      </div>

      <div class="form-group">
        <label for="ticket_platino_full_price">Precio Platino:</label>
        <input type="text" id="ticket_platino_full_price" v-model="event.tickets.platino.full_price" required />
      </div>

      <div class="form-group">
        <label for="ticket_vip_full_price">Precio VIP:</label>
        <input type="text" id="ticket_vip_full_price" v-model="event.tickets.vip.full_price" required />
      </div>

      <div class="form-group">
        <label for="ticket_general_full_price">Precio General:</label>
        <input type="text" id="ticket_general_full_price" v-model="event.tickets.general.full_price" required />
      </div>

      <div class="form-group">
  <label for="faq_1">Pregunta 1: ¿Se venderá comida?</label>
  <select v-model="event.faq[0].answer" required>
    <option :value="true">Sí</option>
    <option :value="false">No</option>
  </select>
</div>

<div class="form-group">
  <label for="faq_2">Pregunta 2: ¿Se venderán bebidas alcohólicas?</label>
  <select v-model="event.faq[1].answer" required>
    <option :value="true">Sí</option>
    <option :value="false">No</option>
  </select>
</div>

      <button type="submit" class="submit-button">Crear Evento</button>

      <!-- Mostrar mensaje de error si hay uno -->
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
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
        place: '',
        age_limit: 0,
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
      errorMessage: ''  // Mensaje de error
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
      try {
        const formData = new FormData();
        const usuario_id = localStorage.getItem('userId');
        console.log('usuario_id:', usuario_id);
        // Agregar los datos del evento
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
        if (this.event.image) {
          formData.append('imagen', this.event.image); // Adjuntar la imagen
        }

        // Realizar la petición POST al backend
        const response = await axios.post('http://localhost:3000/api/events/crear', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Evento creado correctamente', response.data);
        this.errorMessage = ''; // Limpiar cualquier mensaje de error previo

        // Opcional: Puedes redirigir o mostrar un mensaje de éxito aquí
      } catch (error) {
        console.error('Error al crear el evento', error);
        
        // Capturamos el mensaje de error específico
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
.create-event-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-top: 20px;
  text-align: center;
}
</style>
