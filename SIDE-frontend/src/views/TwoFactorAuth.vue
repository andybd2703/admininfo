<template>
  <div class="login-container">
    <!-- Fondo a la izquierda con logo encima -->
    <div class="background-side">
      <div class="overlay">
        <div class="logo-container">
          <img src="https://i.imgur.com/hKU4GaP.png" alt="Logo de la empresa" class="company-logo">
        </div>
      </div>
    </div>

    <!-- Formulario a la derecha -->
    <div class="login-box">
      <h2 class="login-title">Autenticación de Doble Factor</h2>
      <form @submit.prevent="verificarCodigo" class="login-form">
        <!-- Botón para enviar código -->
        <div v-if="!codigoEnviado" class="form-group">
          <button type="button" @click="enviarCodigo" class="btn btn-success btn-xl login-button">
            Enviar código
          </button>
        </div>

        <!-- Campo para ingresar el código -->
        <div v-if="codigoEnviado" class="form-group">
          <label for="codigo" class="form-label">Código de verificación</label>
          <div class="input-group">
            <input
              type="text"
              id="codigo"
              v-model.trim="codigo"
              class="form-control form-control-xl"
              required
              placeholder="Ingrese el código de 6 dígitos"
              maxlength="6"
            >
            <span class="input-icon"><i class="fas fa-shield-alt fa-2x"></i></span>
          </div>
        </div>

        <!-- Botón para verificar -->
        <button v-if="codigoEnviado" type="submit" class="btn btn-primary btn-xl login-button">Verificar</button>

        <!-- Mensaje de error -->
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>

        <!-- Enlace para reenviar código -->
        <div v-if="codigoEnviado" class="register-link">
          ¿No recibió el código?
          <a @click="reenviarCodigo" class="register-button" style="cursor:pointer">Reenviar código</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import emitter from '@/eventBus';
export default {
  name: 'TwoFactorAuth',
  data() {
    return {
      codigo: '',
      errorMessage: '',
      codigoEnviado: false
    };
  },
  methods: {
    async enviarCodigo() {
      try {
        const userId = localStorage.getItem('pending2FAUserId');
        if (!userId) {
          this.errorMessage = 'No se encontró el usuario. Intente iniciar sesión de nuevo.';
          return;
        }

        await axios.post('http://localhost:3000/api/auth/2fa/send-code', { userId });

        this.codigoEnviado = true;
        this.errorMessage = '';
        alert('Código enviado al correo 📬');
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || 'Error al enviar el código';
      }
    },

    async reenviarCodigo() {
      try {
        const userId = localStorage.getItem('pending2FAUserId');
        if (!userId) {
          this.errorMessage = 'No se encontró el usuario. Intente iniciar sesión de nuevo.';
          return;
        }

        await axios.post('http://localhost:3000/api/auth/resend-2fa-code', { userId });

        this.errorMessage = '';
        alert('Código reenviado al correo 📬');
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || 'Error al reenviar el código';
      }
    },

    async verificarCodigo() {
      try {
        const userId = localStorage.getItem('pending2FAUserId');
        if (!userId) {
          this.errorMessage = 'No se encontró el usuario. Intente iniciar sesión de nuevo.';
          return;
        }

        if (!this.codigo || this.codigo.length !== 6) {
          this.errorMessage = 'Ingrese un código válido de 6 dígitos.';
          return;
        }

        const response = await axios.post('http://localhost:3000/api/auth/2fa/validate', {
          userId,
          code: this.codigo
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', response.data.usuario.username);
        localStorage.setItem('rol', response.data.usuario.role);
        localStorage.setItem('userId', response.data.usuario.id);
        emitter.emit('auth-change');

        alert('Código verificado correctamente. ¡Bienvenido! 🎉');
        this.$router.push('/');
        this.errorMessage = '';
      } catch (error) {
        console.error(error);
        this.errorMessage = error.response?.data?.message || 'Error al verificar el código';
      }
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.login-container {
  display: flex;
  min-height: 100vh;
}

.background-side {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1542866263-77e2cdc46889?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  position: relative;
}

.overlay {
  background-color: rgba(2, 41, 121, 0.6); 
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-container {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
 background-color: transparent;  /* opcional para contraste */
}
.company-logo {
  max-width: 100%;
  height: auto;
  filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}


.login-box {
  flex: 1;
  background-color: #fff;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-top: 20px;
  border-radius: 8px;
  text-align: center;
}
</style>
