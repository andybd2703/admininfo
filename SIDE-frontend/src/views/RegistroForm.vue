<template>
  <div class="register-container">
    <div class="register-box">
      <h2 class="register-title text-center">Regístrate</h2>
      <form @submit.prevent="registrarUsuario" class="register-form">
        <div class="form-group">
          <label for="usuario" class="form-label">Usuario</label>
          <input type="text" id="usuario" v-model.trim="usuario.nombre" class="form-control" placeholder="Ingresa tu nombre como usuario">
        </div>
        <div class="form-group">
          <label for="correo" class="form-label">Correo</label>
          <div class="input-group">
            <input type="email" id="correo" v-model.trim="usuario.email" class="form-control" placeholder="Correo">
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
          </div>
        </div>
        <div class="form-group">
          <label for="confirmarCorreo" class="form-label">Confirma tu Correo</label>
          <div class="input-group">
            <input type="email" id="confirmarCorreo" v-model.trim="usuario.confirmarEmail" class="form-control" placeholder="Confirma tu Correo">
            <span class="input-icon"><i class="fas fa-envelope"></i></span>
          </div>
        </div>

        <div class="password-section">
          <h3 class="section-subtitle">Contraseña</h3>
          <p class="password-instructions">Su contraseña debe tener como mínimo 8 caracteres, de los cuales al menos 1 debe ser Numérico, 1 letra en mayúscula y 1 en minúscula.</p>
          <div class="form-group">
            <label for="contrasena" class="form-label">Contraseña</label>
            <div class="input-group">
              <input type="password" id="contrasena" v-model.trim="usuario.password" class="form-control" placeholder="Contraseña">
              <span class="input-icon"><i class="fas fa-lock"></i></span>
            </div>
          </div>
          <div class="form-group">
            <label for="confirmarContrasena" class="form-label">Confirmar Contraseña</label>
            <div class="input-group">
              <input type="password" id="confirmarContrasena" v-model.trim="usuario.confirmarPassword" class="form-control" placeholder="Confirmar Contraseña">
              <span class="input-icon"><i class="fas fa-lock"></i></span>
            </div>
          </div>
        </div>

        <div class="personal-data-section">
          <h3 class="section-subtitle">Datos personales</h3>
          <div class="form-group">
            <label for="nombre" class="form-label">Nombre</label>
            <div class="input-group">
              <input type="text" id="nombre" v-model.trim="usuario.nombre" class="form-control" placeholder="Nombre">
              <span class="input-icon"><i class="fas fa-user"></i></span>
            </div>
          </div>
          <div class="form-group">
            <label for="apellidos" class="form-label">Apellidos</label>
            <div class="input-group">
              <input type="text" id="apellidos" v-model.trim="usuario.apellidos" class="form-control" placeholder="Apellidos">
              <span class="input-icon"><i class="fas fa-user"></i></span>
            </div>
          </div>
          <div class="form-group">
            <label for="fechaNacimiento" class="form-label">Fecha de nacimiento</label>
            <input type="date" id="fechaNacimiento" v-model="usuario.fechaNacimiento" class="form-control">
          </div>
          <div class="form-group">
            <label for="numeroIdentificacion" class="form-label">Número de identificación</label>
            <input type="text" id="numeroIdentificacion" v-model.trim="usuario.numeroIdentificacion" class="form-control" placeholder="Número de identificación">
          </div>
        </div>

        <div class="contact-section">
          <h3 class="section-subtitle">Teléfono</h3>
          <div class="form-group phone-group">
            <select v-model="usuario.telefonoCodigo" class="form-control phone-code">
              <option value="+57">+57</option>
            </select>
            <input type="tel" v-model="usuario.telefono" class="form-control phone-number" placeholder="Móvil">
          </div>
        </div>

        <div class="form-check">
          <input type="checkbox" id="terminos" v-model="usuario.terminos" class="form-check-input" required>
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
        nombre: '',
        email: '',
        confirmarEmail: '',
        password: '',
        confirmarPassword: '',
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

    try {
      // Enviar la solicitud POST al backend para registrar el usuario
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: this.usuario.nombre,
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://i.imgur.com/6IlTFsk.jpeg');
  background-size: cover;
  background-position: center;
}

.register-box {
  background-color: #fff;
  padding: 25px; /* Reduce un poco el padding general */
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 450px; /* Ancho del formulario ajustado */
}

.register-title {
  text-align: center;
  color: #173788; /* Un azul similar al título */
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 1.8rem;
}

.register-form .form-group {
  margin-bottom: 12px; /* Reduce el margen inferior de los grupos */
}

.form-label {
  display: block;
  margin-bottom: 3px;
  color: #333;
  font-weight: normal; /* Fuente normal para las etiquetas */
  font-size: 0.95rem;
}

.form-control {
  width: 100%;
  padding: 8px; /* Reduce el padding de los inputs */
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.95rem;
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
  right: 8px;
  transform: translateY(-50%);
  color: #999;
  font-size: 1rem;
}

.section-subtitle {
  color: #555;
  margin-top: 15px;
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 1rem;
}

.password-instructions {
  color: #777;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.phone-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.phone-code {
  width: 60px;
  flex-shrink: 0;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: 0.95rem;
}

.form-check {
  margin-top: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-check-input {
  margin-right: 5px;
}

.form-check-label {
  font-size: 0.9rem;
  color: #555;
}

.register-button {
  background-color: #173788; /* Un azul similar al botón */
  color: white;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #173788;
}
</style>
