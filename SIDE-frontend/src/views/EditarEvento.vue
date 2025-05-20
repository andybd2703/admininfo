<template>
  <div class="form-page-wrapper">
    <div class="form-main-box">
      <h1 class="form-title">✏️ Editar Evento</h1>

      <form @submit.prevent="editarEvento" class="event-edit-form">
        <div class="form-group">
          <label for="nombre"><i class="fas fa-signature"></i> Nombre:</label>
          <input type="text" id="nombre" v-model="evento.nombre" required />
        </div>

        <div class="form-group">
          <label for="descripcion"><i class="fas fa-align-left"></i> Descripción:</label>
          <textarea id="descripcion" v-model="evento.descripcion"></textarea>
        </div>

        <div class="form-group">
          <label for="imagen"><i class="fas fa-image"></i> Imagen del evento:</label>
          <input type="file" id="imagen" @change="handleFileUpload" accept="image/*" />
          <p class="current-file-info" v-if="evento.imagen && !evento.imagenFile">
            <i class="fas fa-paperclip"></i> Imagen actual: <span class="file-name">{{ evento.imagen }}</span>
          </p>
          <p class="current-file-info" v-if="evento.imagenFile">
            <i class="fas fa-file-image"></i> Nueva imagen seleccionada: <span class="file-name">{{ evento.imagenFile.name }}</span>
          </p>
        </div>

        <div class="form-group">
          <label for="fecha"><i class="fas fa-calendar-alt"></i> Fecha:</label>
          <p class="current-info" v-if="evento.fecha">Fecha actual: <span class="info-value">{{ formatoFecha(evento.fecha) }}</span></p>
          <input type="date" id="fecha" v-model="evento.fecha" required />
        </div>

        <div class="form-group">
          <label for="hora"><i class="fas fa-clock"></i> Hora:</label>
          <input type="time" id="hora" v-model="evento.hora" required />
        </div>

        <div class="form-group">
          <label for="edad_minima"><i class="fas fa-user-friends"></i> Edad mínima:</label>
          <input type="number" id="edad_minima" v-model.number="evento.edad_minima" required min="0" />
        </div>

        <div class="form-group">
          <label for="precio_platino_full"><i class="fas fa-money-bill-alt"></i> Precio Platino:</label>
          <input type="number" id="precio_platino_full" v-model.number="evento.precio_platino_full" step="0.01" required />
        </div>

        <div class="form-group">
          <label for="precio_vip_full"><i class="fas fa-money-bill-alt"></i> Precio VIP:</label>
          <input type="number" id="precio_vip_full" v-model.number="evento.precio_vip_full" step="0.01" required />
        </div>

        <div class="form-group">
          <label for="precio_general_full"><i class="fas fa-money-bill-alt"></i> Precio General:</label>
          <input type="number" id="precio_general_full" v-model.number="evento.precio_general_full" step="0.01" required />
        </div>

        <div class="form-group checkbox-group">
          <label for="vender_comida">
            <input type="checkbox" id="vender_comida" v-model="evento.vender_comida" />
            <span class="checkbox-label"><i class="fas fa-utensils"></i> ¿Se venderá comida?</span>
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label for="vender_bebidas_alcoholicas">
            <input type="checkbox" id="vender_bebidas_alcoholicas" v-model="evento.vender_bebidas_alcoholicas" />
            <span class="checkbox-label"><i class="fas fa-wine-glass-alt"></i> ¿Se venderán bebidas alcohólicas?</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">
            <i class="fas fa-save"></i> Guardar Cambios
          </button>
          <button type="button" @click="eliminarEvento" class="delete-button">
            <i class="fas fa-trash-alt"></i> Eliminar Evento
          </button>
        </div>
      </form>
    </div>
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
      imagen: '', // La imagen actual del evento (nombre del archivo)
      imagenFile: null, // La nueva imagen seleccionada por el usuario (objeto File)
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
        const token = localStorage.getItem('token'); // Asumiendo que necesitas un token para esta ruta
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        const response = await axios.get(`http://localhost:3000/api/events/${eventoId}`, config);
        // Asegúrate de que los booleanos se manejen correctamente si vienen como 0/1 de la DB
        const data = response.data;
        data.vender_comida = Boolean(data.vender_comida);
        data.vender_bebidas_alcoholicas = Boolean(data.vender_bebidas_alcoholicas);

        Object.assign(evento, data);
      } catch (error) {
        alert('Error al cargar el evento. Asegúrate de que el ID es correcto y tienes permisos.');
        console.error(error);
        router.push('/mis-eventos'); // Redirige si el evento no se carga
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
        // Envía los booleanos como 0 o 1 si tu backend lo espera así
        formData.append('vender_comida', evento.vender_comida ? 1 : 0);
        formData.append('vender_bebidas_alcoholicas', evento.vender_bebidas_alcoholicas ? 1 : 0);

        // 👇 Añade la imagen SOLO si el usuario subió una nueva
        if (evento.imagenFile) {
          formData.append('imagen', evento.imagenFile);
        }
        // No enviamos 'imagen' si no hay una nueva y no queremos tocar la existente
        // El backend debe manejar si 'imagen' está ausente o es un nombre de archivo viejo si no se provee un nuevo file.

        const token = localStorage.getItem('token'); // Asumiendo que necesitas un token para esta ruta
        const config = token ? { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } } : { headers: { 'Content-Type': 'multipart/form-data' } };


        await axios.put(`http://localhost:3000/api/events/${eventoId}`, formData, config);

        alert('¡Evento actualizado correctamente!');
        router.go(-1); // Volver a la página anterior (Mis Eventos)
      } catch (error) {
        alert('Error al actualizar el evento. Revisa los datos e intenta de nuevo.');
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
      // Formatear la fecha para que el input type="date" la reconozca
      // Si la fecha viene como 'YYYY-MM-DDTHH:mm:ss.sssZ' (ISO string), 'slice(0, 10)' funciona bien
      return fechaStr.slice(0, 10);
    };

    const eliminarEvento = async () => {
      const confirmar = confirm('¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.');
      if (!confirmar) return;

      try {
        const token = localStorage.getItem('token'); // Asumiendo que necesitas un token para esta ruta
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        await axios.delete(`http://localhost:3000/api/events/${eventoId}`, config);
        alert('¡Evento eliminado correctamente!');
        router.push('/mis-eventos'); // Redirigir a la página de mis eventos
      } catch (error) {
        alert('Error al eliminar el evento. Intenta de nuevo.');
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
/* Importa Font Awesome para los íconos */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Contenedor principal de la página, replicando el fondo suave */
.form-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinea arriba para que el contenido fluya */
  min-height: 100vh; /* Ocupa al menos toda la altura de la ventana */
  padding: 40px 20px; /* Padding para el contenido general */
  background-color: #f0f2f5; /* Un color de fondo suave */
  box-sizing: border-box;
}

/* Caja principal que contiene el formulario */
.form-main-box {
  background-color: rgba(255, 255, 255, 0.95); /* Blanco semitransparente para la caja */
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

.event-edit-form {
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
textarea {
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
textarea:focus {
  border-color: #173788;
  box-shadow: 0 0 0 3px rgba(23, 55, 136, 0.2); /* Sombra de enfoque azul */
  outline: none; /* Eliminar el contorno predeterminado del navegador */
}

textarea {
  resize: vertical; /* Permite redimensionar verticalmente */
  min-height: 100px;
}

/* Estilo para el input[type="file"] y sus mensajes */
input[type="file"] {
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px; /* Espacio antes de los mensajes */
}

.current-file-info, .current-info {
  font-size: 0.95rem;
  color: #666;
  display: flex;
  align-items: center;
  margin-top: -5px; /* Para acercarlo al input */
}

.current-file-info i, .current-info i {
  margin-right: 8px;
  color: #173788;
}

.file-name, .info-value {
    font-weight: bold;
    color: #333;
}

/* Estilos específicos para los checkboxes */
.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 0; /* Reinicia margin-bottom para el label del checkbox */
}

.checkbox-group input[type="checkbox"] {
  width: auto; /* Permite que el checkbox tenga su tamaño natural */
  margin-right: 10px;
  transform: scale(1.3); /* Hace el checkbox un poco más grande */
}

.checkbox-group .checkbox-label {
    font-weight: normal; /* El texto de la etiqueta del checkbox no tan negrita */
    color: #333;
    display: flex;
    align-items: center;
}

.checkbox-group .checkbox-label i {
    margin-right: 8px;
    font-size: 1.1rem;
    color: #173788;
}


/* Contenedor para los botones de acción (Guardar y Eliminar) */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px; /* Espacio entre los botones */
  margin-top: 30px; /* Espacio por encima de los botones */
  flex-wrap: wrap; /* Permite que los botones se envuelvan en pantallas pequeñas */
}

.submit-button,
.delete-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  flex-grow: 1; /* Permite que los botones crezcan para llenar el espacio */
  max-width: 250px; /* Ancho máximo para cada botón */
}

.submit-button {
  background-color: #173788; /* Color principal */
  color: white;
}

.submit-button:hover {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
  transform: translateY(-2px);
}

.delete-button {
  background-color: #dc3545; /* Rojo para eliminar */
  color: white;
}

.delete-button:hover {
  background-color: #c82333; /* Rojo más oscuro al hover */
  transform: translateY(-2px);
}

.submit-button i,
.delete-button i {
  margin-right: 10px;
  font-size: 1.3rem;
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
  input, textarea {
    padding: 10px 12px;
  }
  .submit-button, .delete-button {
    font-size: 1.1rem;
    padding: 12px 25px;
    max-width: none; /* Quitamos el max-width para que se adapten mejor */
  }
  .form-actions {
    flex-direction: column; /* Apila los botones */
    gap: 15px;
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
  .event-edit-form {
    gap: 15px;
  }
  label {
    font-size: 0.95rem;
  }
  label i {
    font-size: 1.2rem;
  }
  input, textarea {
    padding: 9px 10px;
    font-size: 0.95rem;
  }
  .submit-button, .delete-button {
    font-size: 1rem;
    padding: 10px 20px;
  }
  .checkbox-group input[type="checkbox"] {
    transform: scale(1.1);
  }
  .checkbox-group .checkbox-label i {
    font-size: 1rem;
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
  .event-edit-form {
    gap: 12px;
  }
  label {
    font-size: 0.9rem;
  }
  label i {
    font-size: 1.1rem;
  }
  input, textarea {
    padding: 8px;
    font-size: 0.9rem;
  }
  .submit-button, .delete-button {
    font-size: 0.95rem;
    padding: 10px 18px;
  }
  .current-file-info, .current-info {
    font-size: 0.85rem;
  }
}
</style>