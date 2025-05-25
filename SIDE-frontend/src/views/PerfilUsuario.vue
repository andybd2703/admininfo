<template>
  <div class="user-profile">
    <h1>👤 Perfil de Usuario</h1>

    <div v-if="user">
      <form @submit.prevent="actualizarUsuario">
        <!-- Campos existentes -->

        <label>
          Nombre:
          <input type="text" v-model="user.first_name" required />
        </label>

        <label>
          Apellidos:
          <input type="text" v-model="user.last_name" required />
        </label>

        <label>
          Usuario:
          <input type="text" v-model="user.username" required />
        </label>

        <label>
          Email:
          <input type="email" v-model="user.email" required />
        </label>

        <label>
          Fecha de nacimiento:
          <input type="date" v-model="user.birthdate" required />
        </label>

        <label>
          Número de identificación:
          <input type="text" v-model="user.id_number" required />
        </label>

        <label>
          Teléfono:
          <input type="tel" v-model="user.phone_number" required />
        </label>

        <label>
          Rol:
          <input type="text" v-model="user.role" disabled />
        </label>

        <!-- NUEVO: Activar/desactivar 2FA -->
        <label>
          <input
            type="checkbox"
            :checked="twoFactorEnabled"
            @change="toggleTwoFactor($event.target.checked)"
          />
          Activar autenticación de doble factor (2FA)
        </label>
        <small>Al activar, se requerirá un código enviado por email para iniciar sesión.</small>

        <button type="submit">Guardar cambios</button>
      </form>
    </div>

    <div v-else>
      <p>Cargando datos del usuario...</p>
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
          { userId: this.user.id, enabled }, // ojo backend tiene que soportar `enabled`
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
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.user-profile h1 {
  text-align: center;
  color: #333;
}

.user-profile label {
  display: block;
  margin: 0.8rem 0;
}

.user-profile input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.3rem;
  box-sizing: border-box;
}

.user-profile button {
  margin-top: 1.5rem;
  padding: 0.7rem 1.2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.user-profile button:hover {
  background-color: #45a049;
}
</style>
