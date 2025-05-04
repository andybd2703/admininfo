<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/" class="navbar-brand">Eventos Universidad</router-link>
      <!-- Botón para dispositivos pequeños -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Menú de navegación">
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Menú de navegación -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/registro" class="nav-link">Registro</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Mostrar categorías solo si NO estamos en /registro o /login -->
  <router-view></router-view>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const route = useRoute();

    // Ocultar categorías en /registro y /login
    const mostrarCategorias = computed(() => {
      return !['/registro', '/login'].includes(route.path);
    });

    return { mostrarCategorias };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
