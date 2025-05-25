<template>
  <div class="form-page-wrapper">
    <div class="form-main-box">
      <h1 class="form-title">Perfil de Usuario</h1>

      <div v-if="user">
        <form @submit.prevent="actualizarUsuario" class="user-edit-form">

          <div class="form-group">
            <label><i class="fas fa-user"></i> Nombre:</label>
            <input type="text" v-model="user.first_name" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-user-tag"></i> Apellidos:</label>
            <input type="text" v-model="user.last_name" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-user-circle"></i> Usuario:</label>
            <input type="text" v-model="user.username" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-envelope"></i> Email:</label>
            <input type="email" v-model="user.email" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-birthday-cake"></i> Fecha de nacimiento:</label>
            <input type="date" v-model="user.birthdate" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-id-card"></i> Número de identificación:</label>
            <input type="text" v-model="user.id_number" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-phone"></i> Teléfono:</label>
            <input type="tel" v-model="user.phone_number" required />
          </div>

          <div class="form-group">
            <label><i class="fas fa-user-shield"></i> Rol:</label>
            <input type="text" v-model="user.role" disabled />
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                :checked="twoFactorEnabled"
                @change="toggleTwoFactor($event.target.checked)"
              />
              <span class="checkbox-label"><i class="fas fa-lock"></i> Activar autenticación de doble factor (2FA)</span>
            </label>
            <small>Al activar, se requerirá un código enviado por email para iniciar sesión.</small>
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-button">
              <i class="fas fa-save"></i> Guardar cambios
            </button>
          </div>
        </form>
      </div>

      <div v-else>
        <p>Cargando datos del usuario...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UserProfile',
  data() {
    return {
      user: null,
      twoFactorEnabled: false,
      loading2FA: false,
    }
  },
  methods: {
    async fetchUser() {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/api/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.user = response.data
        this.twoFactorEnabled = this.user.two_factor_enabled || false
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error)
      }
    },

    async actualizarUsuario() {
      try {
        const token = localStorage.getItem('token')
        await axios.put(
          `http://localhost:3000/api/usuarios/${this.user.id}`,
          this.user,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert('Perfil actualizado correctamente')
      } catch (error) {
        console.error('Error al actualizar el perfil:', error)
        alert('Error al actualizar el perfil')
      }
    },

    async toggleTwoFactor(enabled) {
      try {
        this.loading2FA = true
        const token = localStorage.getItem('token')
        await axios.post(
          'http://localhost:3000/api/auth/2fa/enable',
          { userId: this.user.id, enabled },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        this.twoFactorEnabled = enabled
        alert(`2FA ${enabled ? 'activado' : 'desactivado'}`)
      } catch (error) {
        alert('Error al cambiar estado 2FA')
        console.error(error)
      } finally {
        this.loading2FA = false
      }
    },
  },
  mounted() {
    this.fetchUser()
  },
}
</script>

<style scoped>
.form-page-wrapper {
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #e6ecf5;
}

.form-main-box {
  width: 100%;
  max-width: 700px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 2rem;
}

.form-title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.user-edit-form .form-group {
  margin-bottom: 1.2rem;
}

.user-edit-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #444;
}

.user-edit-form input {
  width: 100%;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s;
}

.user-edit-form input:focus {
  border-color: #6c63ff;
  outline: none;
}

.checkbox-group {
  margin-top: 1rem;
}

.checkbox-label {
  margin-left: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-button {
  background-color: #0056b3;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

small {
  font-size: 0.85rem;
  color: #666;
}
</style>
