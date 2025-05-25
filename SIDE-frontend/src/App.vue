<template>
  <div id="app">
    <header class="navbar" v-if="mostrarNavbar">
  <div class="navbar-content">
    <router-link to="/">
      <img src="https://i.imgur.com/hKU4GaP.png" alt="Logo" class="logo" />
    </router-link>

    <nav class="menu">
      <!-- <router-link to="/" class="menu-item">Inicio</router-link>  Eliminado -->
      <router-link to="/eventos" class="menu-item">Eventos</router-link>
      <router-link to="/favoritos" class="menu-item">Favoritos</router-link>
      <router-link to="/cart" class="menu-item">Carrito</router-link>
    </nav>


        <div class="auth-buttons">
          <template v-if="nombreUsuario">
            <span
              @click="irAlPerfil"
              class="auth-button perfil-link"
              style="background: transparent; color: #173788; font-weight: bold;"
            >
              {{ nombreUsuario }}
            </span>

            <template v-if="rolUsuario === 'admin' || rolUsuario === 'organizador'">
              <router-link to="/organizador-home" class="auth-button">
                <i class="fas fa-calendar-plus"></i> Panel de eventos
              </router-link>
            </template>

            <template v-if="rolUsuario === 'admin'">
              <router-link to="/admin" class="auth-button">
                <i class="fas fa-cogs"></i> Admin
              </router-link>
            </template>

            <button @click="cerrarSesion" class="auth-button">
              <i class="fas fa-sign-out-alt"></i> Cerrar sesión
            </button>
          </template>

          <template v-else>
            <router-link to="/login" class="auth-button">
              <i class="fas fa-sign-in-alt"></i> Iniciar sesión
            </router-link>
            <router-link to="/registro" class="auth-button">
              <i class="fas fa-user-plus"></i> Registrarse
            </router-link>
          </template>
        </div>
      </div>
    </header>

    <router-view></router-view>

    <footer class="main-footer" v-if="mostrarNavbar">
  <div class="footer-columns">
    <div class="footer-column left-column">
      <h3>SIDE USC</h3>
      <router-link to="/">
        <img src="https://i.imgur.com/hKU4GaP.png" alt="Logo" class="footer-logo" />
      </router-link>
    </div>

    <div class="footer-column center-column">
      <h3>Compañía</h3>
      <ul class="footer-list">
        <li><router-link to="/terminos-y-condiciones" class="footer-link">Términos y condiciones</router-link></li>
        <li><router-link to="/politica-privacidad" class="footer-link">Política de privacidad</router-link></li>
      </ul>
    </div>

    <div class="footer-column right-column">
      <h3>Soporte</h3>
      <ul class="footer-list">
        <li>Correo: <a href="mailto:sistemaintegraldeeventosusc@gmail.com" class="footer-link">sistemaintegraldeeventosusc@gmail.com</a></li>
        <li>WhatsApp: <a href="https://wa.me/573205063020" target="_blank" rel="noopener" class="footer-link">+57 320 5063020</a></li>
      </ul>
    </div>
  </div>
</footer>
  </div>
</template>

<script>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import emitter from '@/eventBus'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const mostrarNavbar = computed(() => {
      return !['/registro', '/login', '/recuperar-contrasena','/2fauth'].includes(route.path)
    })

    const nombreUsuario = ref(null)
    const rolUsuario = ref(null)

    function actualizarUsuario() {
      const token = localStorage.getItem('token')
      const nombreGuardado = localStorage.getItem('usuario')
      const rolGuardado = localStorage.getItem('rol')

      if (token && nombreGuardado) {
        nombreUsuario.value = nombreGuardado
        rolUsuario.value = rolGuardado
      } else {
        nombreUsuario.value = null
        rolUsuario.value = null
      }
    }

    function cerrarSesion() {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      localStorage.removeItem('rol')
      nombreUsuario.value = null
      rolUsuario.value = null
      emitter.emit('auth-change')
      window.location.href = '/login'
    }

    function irAlPerfil() {
      router.push('/perfil')
    }

    onMounted(() => {
      emitter.on('auth-change', actualizarUsuario)
      actualizarUsuario()
    })

    onBeforeUnmount(() => {
      emitter.off('auth-change', actualizarUsuario)
    })

    return { mostrarNavbar, nombreUsuario, rolUsuario, cerrarSesion, irAlPerfil }
  }
}
</script>

<style>
/* Estilos generales */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
}

/* Barra de navegación */
.navbar {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
  padding: 15px 20px;
}

/* Contenedor de la barra */
.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Logo */
.logo {
  height: 50px;
  margin-right: 20px;
}

/* Menú de navegación */
.menu {
  display: flex;
  gap: 15px;
  margin-right: auto;
}

.menu-item {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  transition: color 0.3s, background-color 0.3s;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 1rem;
}

.menu-item:hover {
  color: #007bff;
  background-color: #e9ecef;
}

/* Botones de autenticación */
.auth-buttons {
  display: flex;
  gap: 15px;
}

.auth-button {
  text-decoration: none;
  color: #fff;
  background: #173788;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease-in-out;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
}

.auth-button:hover {
  transform: scale(1.05);
  background: #12275d;
}

.perfil-link {
  cursor: pointer;
  transition: color 0.3s ease;
}

.perfil-link:hover {
  text-decoration: underline;
  color: #0d2f73;
}

.main-footer {
  background-color: #173788;
  color: #fff;
  padding: 30px 20px;
}

.footer-columns {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.footer-column {
  text-align: left;
  flex: 1;
  padding: 0 15px;
  min-width: 180px;
}

.footer-column h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 8px;
  font-size: 1rem;
}

.footer-logo {
  margin-top: 10px;
  height: 100px;
  display: block;
  filter: brightness(0) invert(1); /* para que el logo blanco se vea bien si es oscuro */

}

.footer-link {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #a8c0ff;
  text-decoration: underline;
}

/* Opcional para columnas específicas */
.left-column {
  max-width: 200px;
}

.center-column,
.right-column {
  max-width: 220px;
}

</style>
