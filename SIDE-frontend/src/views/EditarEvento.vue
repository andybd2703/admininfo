<template>
  <div class="editar-evento">
    <h1>Editar Evento</h1>

    <form @submit.prevent="editarEvento">
      <div>
        <label>Nombre:</label>
        <input v-model="evento.nombre" required />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea v-model="evento.descripcion"></textarea>
      </div>

      <div>
        <label>Imagen del evento:</label>
        <input type="file" @change="handleFileUpload" accept="image/*" />
        <p v-if="evento.imagen && !evento.imagenFile">📎 Imagen actual: {{ evento.imagen }}</p>
        <p v-if="evento.imagenFile">📎 Nueva imagen seleccionada: {{ evento.imagenFile.name }}</p>
      </div>

      <div>
        <label>Fecha:</label>
        <p v-if="evento.fecha">Fecha actual del evento: {{ formatoFecha(evento.fecha) }}</p>
        <input type="date" v-model="evento.fecha" required />
      </div>

      <div>
        <label>Hora:</label>
        <input type="time" v-model="evento.hora" required />
      </div>

      <div>
        <label>Edad mínima:</label>
        <input type="number" v-model.number="evento.edad_minima" required />
      </div>

      <div>
        <label>Precio Platino:</label>
        <input type="number" v-model.number="evento.precio_platino_full" step="0.01" required />
      </div>

      <div>
        <label>Precio VIP:</label>
        <input type="number" v-model.number="evento.precio_vip_full" step="0.01" required />
      </div>

      <div>
        <label>Precio General:</label>
        <input type="number" v-model.number="evento.precio_general_full" step="0.01" required />
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="evento.vender_comida" />
          ¿Se venderá comida?
        </label>
      </div>

      <div>
        <label>
          <input type="checkbox" v-model="evento.vender_bebidas_alcoholicas" />
          ¿Se venderán bebidas alcohólicas?
        </label>
      </div>

      <button type="submit">Guardar Cambios</button>
      <button type="button" @click="eliminarEvento" style="margin-left: 1rem; background-color: crimson; color: white;">
        Eliminar Evento ❌
      </button>
    </form>
  </div>
</template>

<script>
import { reactive } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'EditarEvento',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventoId = route.params.id;

    const evento = reactive({
      nombre: '',
      descripcion: '',
      imagen: '', // La imagen actual del evento
      imagenFile: null, // La nueva imagen seleccionada por el usuario
      fecha: '',
      hora: '',
      edad_minima: 0,
      precio_platino_full: 0.00,
      precio_vip_full: 0.00,
      precio_general_full: 0.00,
      vender_comida: false,
      vender_bebidas_alcoholicas: false
    });

    const cargarEvento = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${eventoId}`);
        Object.assign(evento, response.data);
      } catch (error) {
        alert('Error al cargar el evento');
        console.error(error);
      }
    };

    const editarEvento = async () => {
      try {
        const formData = new FormData();
        formData.append('nombre', evento.nombre);
        formData.append('descripcion', evento.descripcion);
        formData.append('fecha', evento.fecha);
        formData.append('hora', evento.hora);
        formData.append('edad_minima', evento.edad_minima);
        formData.append('precio_platino_full', evento.precio_platino_full);
        formData.append('precio_vip_full', evento.precio_vip_full);
        formData.append('precio_general_full', evento.precio_general_full);
        formData.append('vender_comida', evento.vender_comida);
        formData.append('vender_bebidas_alcoholicas', evento.vender_bebidas_alcoholicas);

        // 👇 Añade la imagen SOLO si el usuario subió una nueva
        if (evento.imagenFile) {
          formData.append('imagen', evento.imagenFile);
        } else if (evento.imagen) {
          // Si no se selecciona una nueva imagen, se mantiene la imagen actual
          formData.append('imagen', evento.imagen);
        }

        await axios.put(`http://localhost:3000/api/events/${eventoId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        alert('Evento actualizado correctamente');
        router.go(-1);
      } catch (error) {
        alert('Error al actualizar el evento');
        console.error(error);
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        evento.imagenFile = file;
      }
    };

    const formatoFecha = (fechaStr) => {
      if (!fechaStr) return '';
      const fecha = new Date(fechaStr);
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      return `${año}-${mes}-${dia}`;
    };

    const eliminarEvento = async () => {
      const confirmar = confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.');
      if (!confirmar) return;

      try {
        await axios.delete(`http://localhost:3000/api/events/${eventoId}`);
        alert('Evento eliminado correctamente');
        router.go(-1);
      } catch (error) {
        alert('Error al eliminar el evento');
        console.error(error);
      }
    };

    cargarEvento();

    return {
      evento,
      editarEvento,
      formatoFecha,
      handleFileUpload,
      eliminarEvento
    };
  }
};
</script>

<style scoped>
.editar-evento {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}
.editar-evento form > div {
  margin-bottom: 1rem;
}
</style>
