<template>
    <div class="recovery-container">
      <div class="recovery-box">
        <h2 class="recovery-title">Recuperar Contraseña</h2>
        <form @submit.prevent="enviarCorreoRecuperacion" class="recovery-form">
          <div class="form-group">
            <label for="email" class="form-label">Correo Electrónico</label>
            <div class="input-group">
              <input
                type="email"
                id="email"
                v-model.trim="email"
                class="form-control form-control-xl"
                required
                placeholder="Ingrese su correo"
              >
              <span class="input-icon">
                <i class="fas fa-envelope fa-2x"></i>
              </span>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-xl recovery-button">
            Enviar enlace de recuperación
          </button>
          <div class="back-to-login">
            <router-link to="/login">Volver al inicio de sesión</router-link>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  name: 'RecuperarContrasena',
  data() {
    return {
      email: '',
      mensaje: ''
    };
  },
  methods: {
    async enviarCorreoRecuperacion() {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/recover-password', {
          email: this.email
        });

        this.mensaje = response.data.message || 'Correo enviado con éxito';
        alert(this.mensaje);
        this.email = '';
      } catch (error) {
        console.error('Error al enviar el correo:', error);
        this.mensaje = error.response?.data?.message || 'Error al enviar el correo';
        alert(this.mensaje);
      }
    }
  }
};
</script>

  
  <style scoped>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  
  .recovery-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1542866263-77e2cdc46889?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
}
  
  .recovery-box {
    background-color: #fff;
    padding: 50px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    width: 500px;
  }
  
  .recovery-title {
    text-align: center;
    color: #173788;
    margin-bottom: 40px;
    font-size: 2.4rem;
    font-weight: bold;
  }
  
  .recovery-form .form-group {
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
    font-size: 1.3rem;
    border-radius: 8px;
    width: 100%;
  }
  
  .recovery-button {
    background-color: #173788;
    color: white;
    border: none;
    transition: background-color 0.3s ease;
  }
  
  .recovery-button:hover {
    background-color: #0056b3;
  }
  
  .back-to-login {
    text-align: center;
    margin-top: 25px;
    font-size: 1.1rem;
  }
  
  .back-to-login a {
    color: #007bff;
    text-decoration: none;
    font-weight: bold;
  }
  
  .back-to-login a:hover {
    text-decoration: underline;
  }
  </style>
  