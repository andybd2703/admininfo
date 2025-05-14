<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">Iniciar Sesión</h2>
      <form @submit.prevent="iniciarSesion" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Correo</label>
          <div class="input-group">
            <input
              type="email"
              id="email"
              v-model.trim="usuario.email"
              class="form-control form-control-xl"
              required
              placeholder="Ingrese su correo"
            >
            <span class="input-icon"><i class="fas fa-envelope fa-2x"></i></span>
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <input
              type="password"
              id="password"
              v-model.trim="usuario.password"
              class="form-control form-control-xl"
              required
              placeholder="Ingrese su contraseña"
            >
            <span class="input-icon"><i class="fas fa-lock fa-2x"></i></span>
          </div>
        </div>

        <div class="form-options">
          <div class="form-check">
            <input type="checkbox" id="remember" class="form-check-input form-check-input-xl">
            <label for="remember" class="form-check-label">Recuérdame</label>
          </div>
          <router-link to="/recuperar-contrasena" class="forgot-password">
            ¿Olvidó su contraseña?
          </router-link>
        </div>

        <button type="submit" class="btn btn-primary btn-xl login-button">Iniciar Sesión</button>

        <!-- Mostrar mensaje de error si existe -->
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>

        <div class="register-link">
          ¿No tiene una cuenta?
          <router-link to="/registro" class="register-button">
            registrese
          </router-link>
          
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importamos axios para las solicitudes HTTP
import emitter from '@/eventBus';
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
        localStorage.setItem('usuario', response.data.usuario.username);
        localStorage.setItem('rol', response.data.usuario.role);
        localStorage.setItem('userId', response.data.usuario.id);
        console.log(localStorage.getItem('userId'));
        emitter.emit('auth-change');
        // Limpiamos los campos del formulario
        this.usuario = { email: '', password: '' };

        // Redirigimos al usuario a la página principal
        this.$router.push('/');  // Aquí está el cambio

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
/* Estilos del componente */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://i.imgur.com/6IlTFsk.jpeg');
  background-size: cover;
  background-position: center;
}

.login-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 500px;
}

.login-title {
  text-align: center;
  color: #173788;
  margin-bottom: 40px;
  font-size: 2.6rem;
  font-weight: bold;
}

.login-form .form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  font-size: 1.2rem;
}

.form-control-xl {
  width: 100%;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.2rem;
  box-sizing: border-box;
}

.input-group {
  position: relative;
  display: flex;
  width: 100%;
}

.input-icon {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  color: #777;
  font-size: 1.5rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.form-check {
  display: flex;
  align-items: center;
}

.form-check-input-xl {
  transform: scale(1.4);
  margin-right: 10px;
}

.form-check-label {
  font-size: 1.2rem;
}

.forgot-password {
  color: #007bff;
  text-decoration: none;
  font-size: 1.1rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-xl {
  padding: 16px 32px;
  font-size: 1.4rem;
  border-radius: 8px;
}

.login-button {
  background-color: #173788;
  color: white;
  border: none;
  width: 100%;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #0056b3;
}

.register-link {
  text-align: center;
  margin-top: 30px;
  font-size: 1.1rem;
}

.register-button {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
}

.register-button:hover {
  text-decoration: underline;
}

/* Estilos para mostrar el mensaje de error */
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-top: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
