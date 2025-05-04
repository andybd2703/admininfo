<template>
  <div class="container mt-5">
    <h2 class="text-center">Iniciar Sesión</h2>
    <form @submit.prevent="iniciarSesion" class="mt-3">
      <div class="mb-3">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model.trim="usuario.email" 
          class="form-control" 
          required 
          placeholder="Ingrese su correo">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model.trim="usuario.password" 
          class="form-control" 
          required 
          placeholder="Ingrese su contraseña">
      </div>
      <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
    </form>
    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p> <!-- Muestra el mensaje de error -->
  </div>
</template>

<script>
import axios from 'axios'; // Importamos axios para las solicitudes HTTP

export default {
  name: 'LoginForm',
  data() {
    return {
      usuario: {
        email: '',
        password: ''
      },
      errorMessage: '' // Variable para almacenar mensajes de error
    };
  },
  methods: {
    async iniciarSesion() {
      try {
        // Hacemos una solicitud POST al backend con los datos del usuario
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.usuario.email,
          password: this.usuario.password
        });

        // Si la solicitud es exitosa, almacenamos el token en localStorage
        localStorage.setItem('token', response.data.token);

        // Limpiamos los campos del formulario
        this.usuario = { email: '', password: '' };

        // Redirigimos al usuario a una página protegida (puedes cambiar esta ruta)
        this.$router.push('/dashboard');  // Actualiza con la ruta a la que quieras redirigir

      } catch (error) {
        // En caso de error, mostramos un mensaje al usuario
        if (error.response) {
          // Si la respuesta del servidor contiene un mensaje de error
          this.errorMessage = error.response.data.message || 'Error desconocido';
        } else {
          // Si no hay respuesta (puede ser un problema de conexión)
          this.errorMessage = 'No se pudo conectar al servidor';
        }
      }
    }
  }
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales si lo deseas */
</style>
