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
              :max="fechaMaximaPermitida"
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
              <option v-for="codigo in codigosTelefonicos" :key="codigo.value" :value="codigo.value">
                {{ codigo.label }}
              </option>
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
import axios from 'axios';

export default {
  name: 'RegistroForm',
  data() {
    return {
      usuario: {
        nombreUsuario: '',
        email: '',
        confirmarEmail: '',
        password: '',
        confirmarPassword: '',
        nombre: '',
        apellidos: '',
        fechaNacimiento: '',
        numeroIdentificacion: '',
        telefonoCodigo: '+57',
        telefono: '',
        terminos: false
      },

      codigosTelefonicos: [
      { value: '+1', label: '+1 Canadá' },
  { value: '+1', label: '+1 Estados Unidos' },
  { value: '+1-340', label: '+1-340 Islas Vírgenes de EE.UU.' },
  { value: '+1-670', label: '+1-670 Islas Marianas del Norte' },
  { value: '+1-671', label: '+1-671 Guam' },
  { value: '+1-684', label: '+1-684 Samoa Americana' },
  { value: '+1-787', label: '+1-787 Puerto Rico' },
  { value: '+1-939', label: '+1-939 Puerto Rico' },
  { value: '+1-441', label: '+1-441 Bermudas' },
  { value: '+299', label: '+299 Groenlandia' },
  { value: '+508', label: '+508 San Pedro y Miquelón' },
  { value: '+52', label: '+52 México' },

  // Islas del Caribe
  { value: '+1-242', label: '+1-242 Bahamas' },
  { value: '+1-246', label: '+1-246 Barbados' },
  { value: '+1-264', label: '+1-264 Anguila' },
  { value: '+1-268', label: '+1-268 Antigua y Barbuda' },
  { value: '+1-284', label: '+1-284 Islas Vírgenes Británicas' },
  { value: '+1-345', label: '+1-345 Islas Caimán' },
  { value: '+1-473', label: '+1-473 Granada' },
  { value: '+1-649', label: '+1-649 Islas Turcas y Caicos' },
  { value: '+1-664', label: '+1-664 Montserrat' },
  { value: '+1-721', label: '+1-721 San Martín' },
  { value: '+1-758', label: '+1-758 Santa Lucía' },
  { value: '+1-767', label: '+1-767 Dominica' },
  { value: '+1-784', label: '+1-784 San Vicente y las Granadinas' },
  { value: '+1-809', label: '+1-809 República Dominicana' },
  { value: '+1-829', label: '+1-829 República Dominicana' },
  { value: '+1-849', label: '+1-849 República Dominicana' },
  { value: '+1-868', label: '+1-868 Trinidad y Tobago' },
  { value: '+1-869', label: '+1-869 San Cristóbal y Nieves' },
  { value: '+1-876', label: '+1-876 Jamaica' },
  { value: '+1-658', label: '+1-658 Jamaica' },
  { value: '+297', label: '+297 Aruba' },
  { value: '+509', label: '+509 Haití' },
  { value: '+53', label: '+53 Cuba' },
  { value: '+590', label: '+590 Guadalupe, San Martín y San Bartolomé' },
  { value: '+596', label: '+596 Martinica' },
  { value: '+599', label: '+599 Curazao, Bonaire, San Eustaquio y Saba' },

  // América Central
  { value: '+501', label: '+501 Belice' },
  { value: '+502', label: '+502 Guatemala' },
  { value: '+503', label: '+503 El Salvador' },
  { value: '+504', label: '+504 Honduras' },
  { value: '+505', label: '+505 Nicaragua' },
  { value: '+506', label: '+506 Costa Rica' },
  { value: '+507', label: '+507 Panamá' },

  // América del Sur
  { value: '+500', label: '+500 Islas Malvinas e Islas Georgias del Sur' },
  { value: '+51', label: '+51 Perú' },
  { value: '+54', label: '+54 Argentina' },
  { value: '+55', label: '+55 Brasil' },
  { value: '+56', label: '+56 Chile' },
  { value: '+57', label: '+57 Colombia' },
  { value: '+58', label: '+58 Venezuela' },
  { value: '+591', label: '+591 Bolivia' },
  { value: '+592', label: '+592 Guyana' },
  { value: '+593', label: '+593 Ecuador' },
  { value: '+594', label: '+594 Guayana Francesa' },
  { value: '+595', label: '+595 Paraguay' },
  { value: '+597', label: '+597 Surinam' },
  { value: '+598', label: '+598 Uruguay' },

  // África (solo algunos para ejemplo)
  { value: '+20', label: '+20 Egipto' },
  { value: '+211', label: '+211 Sudán del Sur' },
  { value: '+212', label: '+212 Marruecos' },
  { value: '+213', label: '+213 Argelia' },
  { value: '+216', label: '+216 Túnez' },
  { value: '+218', label: '+218 Libia' },
  { value: '+220', label: '+220 Gambia' },
  { value: '+221', label: '+221 Senegal' },
  { value: '+222', label: '+222 Mauritania' },
  { value: '+223', label: '+223 Mali' },
  { value: '+224', label: '+224 Guinea' },

  // Europa (solo algunos)
  { value: '+30', label: '+30 Grecia' },
  { value: '+31', label: '+31 Países Bajos' },
  { value: '+32', label: '+32 Bélgica' },
  { value: '+33', label: '+33 Francia' },
  { value: '+34', label: '+34 España' },
  { value: '+39', label: '+39 Italia' },
  { value: '+44', label: '+44 Reino Unido' },
  { value: '+49', label: '+49 Alemania' },
  { value: '+7', label: '+7 Rusia / Kazajistán' },

  // Asia (solo algunos)
  { value: '+81', label: '+81 Japón' },
  { value: '+82', label: '+82 Corea del Sur' },
  { value: '+84', label: '+84 Vietnam' },
  { value: '+86', label: '+86 China' },
  { value: '+90', label: '+90 Turquía' },
  { value: '+91', label: '+91 India' },

  // Oceanía
  { value: '+60', label: '+60 Malasia' },
  { value: '+61', label: '+61 Australia' },
  { value: '+62', label: '+62 Indonesia' },
  { value: '+63', label: '+63 Filipinas' },
  { value: '+64', label: '+64 Nueva Zelanda' },
  { value: '+65', label: '+65 Singapur' }
    ]
    };
  },
  computed: {
    fechaMaximaPermitida() {
      const hoy = new Date();
      hoy.setFullYear(hoy.getFullYear() - 16);
      return hoy.toISOString().split('T')[0];
    }
  },
  methods: {
    validarPassword(password) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return regex.test(password);
    },

    soloNumeros(campo) {
      this.usuario[campo] = this.usuario[campo].replace(/\D/g, '');
    },

    tieneEdadMinima(fechaNacimiento) {
      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      const dia = hoy.getDate() - nacimiento.getDate();

      if (
        edad > 16 ||
        (edad === 16 && (mes > 0 || (mes === 0 && dia >= 0)))
      ) {
        return true;
      }

      return false;
    },

    async registrarUsuario() {
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

      if (this.usuario.email !== this.usuario.confirmarEmail) {
        alert('Los correos no coinciden.');
        return;
      }

      if (!this.usuario.fechaNacimiento) {
        alert('Por favor, ingresa tu fecha de nacimiento.');
        return;
      }

      if (!this.tieneEdadMinima(this.usuario.fechaNacimiento)) {
        alert('Debes tener al menos 16 años para registrarte.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username: this.usuario.nombreUsuario,
          email: this.usuario.email,
          password: this.usuario.password,
          firstName: this.usuario.nombre,
          lastName: this.usuario.apellidos,
          birthdate: this.usuario.fechaNacimiento,
          idNumber: this.usuario.numeroIdentificacion,
          phoneNumber: this.usuario.telefonoCodigo + this.usuario.telefono,
          role: 'usuario'
        });

        alert(response.data.message);
        this.$router.push('/login');
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