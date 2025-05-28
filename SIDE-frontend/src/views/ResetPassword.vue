<template>
  <div class="reset-container">
    <div class="reset-box">
      <h2 class="reset-title">Restablecer Contraseña</h2>
      <form @submit.prevent="enviarNuevaContrasena">
        <div class="form-group">
          <label for="password">Nueva Contraseña</label>
          <input
            v-model="password"
            type="password"
            id="password"
            required
            minlength="6"
            class="form-control"
            placeholder="Ingrese nueva contraseña"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            id="confirmPassword"
            required
            minlength="6"
            class="form-control"
            placeholder="Confirme la contraseña"
          />
        </div>

        <button :disabled="loading" type="submit" class="btn btn-primary btn-xl">
          {{ loading ? 'Enviando...' : 'Restablecer' }}
        </button>

        <div v-if="mensaje" :class="['mensaje', mensajeTipo, 'mt-3']">
          {{ mensaje }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ResetPassword',
  data() {
    return {
      password: '',
      confirmPassword: '',
      token: '',
      mensaje: '',
      mensajeTipo: '',
      loading: false
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token') || '';
  },
  methods: {
    async enviarNuevaContrasena() {
      if (!this.token) {
        this.mensaje = 'Token inválido o ausente.';
        this.mensajeTipo = 'text-danger';
        return;
      }

      if (this.password.length < 6) {
        this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
        this.mensajeTipo = 'text-danger';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.mensaje = 'Las contraseñas no coinciden.';
        this.mensajeTipo = 'text-danger';
        return;
      }

      this.loading = true;

      try {
        const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
          token: this.token,
          password: this.password
        });

        this.mensaje = response.data.message || 'Contraseña restablecida con éxito';
        this.mensajeTipo = 'text-success';
        this.password = '';
        this.confirmPassword = '';
      } catch (error) {
        this.mensaje = error.response?.data?.message || 'Error al restablecer contraseña';
        this.mensajeTipo = 'text-danger';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.reset-container {
 display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1542866263-77e2cdc46889?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;}

.reset-box {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow
  : 0 0 12px rgba(0, 0, 0, 0.1);
  width: 420px;
}

.reset-title {
  text-align: center;
  margin-bottom: 30px;
  color: #173788;
  font-size: 2rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-control {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.btn-xl {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
  background-color: #173788;
  border: none;
  color: white;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-xl:hover {
  background-color: #0056b3;
}

.text-danger {
  color: red;
}

.text-success {
  color: green;
}

.mensaje {
  text-align: center;
  font-weight: 500;
}
</style>
