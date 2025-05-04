<template>
  <div class="container mt-5">
    <h2 class="text-center">Registro</h2>
    <form @submit.prevent="registrarUsuario" class="mt-3">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre Completo</label>
        <input 
          type="text" 
          id="nombre" 
          v-model.trim="usuario.nombre" 
          class="form-control" 
          required 
          placeholder="Ingrese su nombre">
      </div>
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
          placeholder="Cree una contraseña">
      </div>
      <button type="submit" class="btn btn-success w-100">Registrarse</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';  // Importa axios para hacer la solicitud HTTP

export default {
  name: 'RegistroForm',
  data() {
    return {
      usuario: {
        nombre: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async registrarUsuario() {
      // Verificar si los campos están completos
      if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password) {
        alert('Por favor, complete todos los campos.');
        return;
      }

      try {
        // Enviar la solicitud POST al backend para registrar el usuario
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username: this.usuario.nombre,  // Usamos el nombre completo como el nombre de usuario
          email: this.usuario.email,
          password: this.usuario.password
        });

        // Si el registro es exitoso, mostrar mensaje y redirigir al login
        alert(response.data.message);
        this.$router.push('/login');  // Redirige al login después del registro
      } catch (error) {
        console.error('Error al registrar usuario:', error.response);
        alert('Hubo un error al registrar el usuario');
      }
    }
  }
};
</script>
