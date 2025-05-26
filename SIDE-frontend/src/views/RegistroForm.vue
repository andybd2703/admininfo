<template>
  <div class="register-container">

    <!-- Fondo a la izquierda con logo encima -->
    <div class="background-side">
      <div class="overlay">
        <div class="logo-container">
          <img src="https://i.imgur.com/hKU4GaP.png" alt="Logo de la empresa" class="company-logo" />
        </div>
      </div>
    </div>

    <!-- Registro a la derecha -->
    <div class="register-box">
      <h2 class="register-title">Regístrate</h2>
      <form @submit.prevent="registrarUsuario" class="register-form">

        <div class="form-group">
          <label for="usuario" class="form-label">Usuario</label>
          <input
            type="text"
            id="usuario"
            v-model.trim="usuario.nombreUsuario"
            class="form-control"
            placeholder="Ingresa tu nombre de usuario"
          >
        </div>

        <div class="form-group">
          <label for="correo" class="form-label">Correo</label>
          <div class="input-group">
            <input
              type="email"
              id="correo"
              v-model.trim="usuario.email"
              class="form-control"
              placeholder="Correo"
            >
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
          </div>
        </div>

        <div class="form-group">
          <label for="confirmarCorreo" class="form-label">Confirma tu Correo</label>
          <div class="input-group">
            <input
              type="email"
              id="confirmarCorreo"
              v-model.trim="usuario.confirmarEmail"
              class="form-control"
              placeholder="Confirma tu Correo"
            >
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
          </div>
        </div>

        <div class="password-section">
          <h3 class="section-subtitle">Contraseña</h3>
          <p class="password-instructions">
            Su contraseña debe tener como mínimo 8 caracteres, de los cuales al menos 1 debe ser numérico, 1 letra en mayúscula y 1 en minúscula.
          </p>
          <div class="form-group">
            <label for="contrasena" class="form-label">Contraseña</label>
            <div class="input-group">
              <input
                type="password"
                id="contrasena"
                v-model.trim="usuario.password"
                class="form-control"
                placeholder="Contraseña"
              >
              <span class="input-icon"><i class="fas fa-lock"></i></span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmarContrasena" class="form-label">Confirmar Contraseña</label>
            <div class="input-group">
              <input
                type="password"
                id="confirmarContrasena"
                v-model.trim="usuario.confirmarPassword"
                class="form-control"
                placeholder="Confirmar Contraseña"
              >
              <span class="input-icon"><i class="fas fa-lock"></i></span>
            </div>
          </div>
        </div>

        <div class="personal-data-section">
          <h3 class="section-subtitle">Datos personales</h3>

          <div class="form-group">
            <label for="nombre" class="form-label">Nombre</label>
            <div class="input-group">
              <input
                type="text"
                id="nombre"
                v-model.trim="usuario.nombre"
                class="form-control"
                placeholder="Nombre"
              >
              <span class="input-icon"><i class="fas fa-user"></i></span>
            </div>
          </div>

          <div class="form-group">
            <label for="apellidos" class="form-label">Apellidos</label>
            <div class="input-group">
              <input
                type="text"
                id="apellidos"
                v-model.trim="usuario.apellidos"
                class="form-control"
                placeholder="Apellidos"
              >
              <span class="input-icon"><i class="fas fa-user"></i></span>
            </div>
          </div>

          <div class="form-group">
            <label for="fechaNacimiento" class="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              id="fechaNacimiento"
              v-model="usuario.fechaNacimiento"
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="numeroIdentificacion" class="form-label">Número de identificación</label>
            <input
              type="text"
              id="numeroIdentificacion"
              v-model="usuario.numeroIdentificacion"
              @input="soloNumeros('numeroIdentificacion')"
              class="form-control"
              placeholder="Número de identificación"
            >
          </div>
        </div>

        <div class="contact-section">
          <h3 class="section-subtitle">Teléfono</h3>
          <div class="form-group phone-group">
            <select v-model="usuario.telefonoCodigo" class="form-control phone-code">
              <option value="+57">+57</option>
            </select>
            <input
              type="text"
              v-model="usuario.telefono"
              @input="soloNumeros('telefono')"
              class="form-control phone-number"
              placeholder="Móvil"
            >
          </div>
        </div>

        <div class="form-check">
          <input
            type="checkbox"
            id="terminos"
            v-model="usuario.terminos"
            class="form-check-input"
            required
          >
          <label class="form-check-label" for="terminos">Acepto los términos y condiciones</label>
        </div>

        <button type="submit" class="btn btn-primary register-button">Regístrate</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';  // Importa axios para hacer la solicitud HTTP

export default {
  name: 'RegistroForm',
  data() {
    return {
      usuario: {
  nombreUsuario: '', // <- nombre de usuario (username)
  email: '',
  confirmarEmail: '',
  password: '',
  confirmarPassword: '',
  nombre: '', // <- nombre real
  apellidos: '',
  fechaNacimiento: '',
  numeroIdentificacion: '',
  telefonoCodigo: '+57',
  telefono: '',
  terminos: false
}
    };
  },
  methods: {

    validarPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  },

  soloNumeros(campo) {
    this.usuario[campo] = this.usuario[campo].replace(/\D/g, '');
  },

  async registrarUsuario() {
    // Verificar si los campos están completos
    if (!this.usuario.nombre || !this.usuario.email || !this.usuario.password || !this.usuario.terminos) {
      alert('Por favor, complete todos los campos y acepte los términos.');
      return;
    }

    if (this.usuario.password !== this.usuario.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    if (!this.validarPassword(this.usuario.password)) {
      alert('La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número.');
      return;
    }



    try {
      // Enviar la solicitud POST al backend para registrar el usuario
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: this.usuario.nombreUsuario,
        email: this.usuario.email,
        password: this.usuario.password,
        firstName: this.usuario.nombre,  // Usar nombre como firstName
        lastName: this.usuario.apellidos, // Usar apellidos como lastName
        birthdate: this.usuario.fechaNacimiento, // Enviar la fecha de nacimiento
        idNumber: this.usuario.numeroIdentificacion, // Enviar el número de identificación
        phoneNumber: this.usuario.telefonoCodigo + this.usuario.telefono, // Concatenar el código de país y teléfono
        role: 'usuario'  // Asignar un rol predeterminado
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
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.register-container {
  display: flex;
  height: 100vh;
}

/* Fondo a la izquierda, igual que login */
.background-side {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1542866263-77e2cdc46889?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background-side::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(2, 41, 121, 0.6);
  z-index: 1;
}

.background-side > * {
  position: relative;
  z-index: 2;
}

.logo-container {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: transparent;
}

.company-logo {
  max-width: 100%;
  height: auto;
  filter: brightness(0) invert(1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}

/* Formulario a la derecha */
.register-box {
  flex: 1;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 40px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: 100vh;
  height: 100%;
}

.register-form {
  width: 100%;
  max-width: 600px;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

.register-container {
  height: 100vh;
  overflow: hidden;
}

@media (max-height: 700px) {
  .register-box {
    padding: 20px;
    overflow-y: auto;
  }
}

.register-title {
  text-align: center;
  color: #173788;
  margin-bottom: 40px;
  font-size: 2.6rem;
  font-weight: bold;
}

.register-form .form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
  font-size: 1.2rem;
}

.form-control {
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

.section-subtitle {
  font-size: 1.5rem;
  color: #173788;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 40px;
}

.password-instructions {
  font-size: 1rem;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.4;
}

.phone-group {
  display: flex;
  gap: 10px;
}

.phone-code {
  width: 25%;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1.2rem;
}

.phone-number {
  flex: 1;
}

.form-check {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.form-check-input {
  transform: scale(1.4);
  margin-right: 10px;
}

.form-check-label {
  font-size: 1.2rem;
}

.btn-primary {
  background-color: #173788;
  color: white;
  border: none;
  width: 100%;
  padding: 16px 32px;
  font-size: 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-top: 20px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
}

</style>