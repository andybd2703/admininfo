<template>
  <div class="user-profile">
    <h1>👤 Perfil de Usuario</h1>
    <div v-if="user">
      <p><strong>Nombre:</strong> {{ user.first_name }}</p>
      <p><strong>Apellidos:</strong> {{ user.last_name }}</p>
      <p><strong>Usuario:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Fecha de nacimiento:</strong> {{ formatDate(user.birthdate) }}</p>
      <p><strong>Número de identificación:</strong> {{ user.id_number }}</p>
      <p><strong>Teléfono:</strong> {{ user.phone_number }}</p>
      <p><strong>Rol:</strong> {{ user.role }}</p>
      <p><strong>Miembro desde:</strong> {{ formatDate(user.created_at) }}</p>
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
    }
  },
  methods: {
    async fetchUser() {
      try {
        const userId = localStorage.getItem('userId');  // Obtenemos el id del usuario desde la URL
        const response = await axios.get(`/api/user/${userId}`) // Solicitar el perfil del usuario específico
        this.user = response.data
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error)
      }
    },
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString(undefined, options)
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

.user-profile p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
</style>
