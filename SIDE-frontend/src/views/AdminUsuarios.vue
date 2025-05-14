<template>
  <div class="admin-usuarios p-6">
    <h2 class="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
    
    <!-- Tabla de usuarios -->
    <table class="table-auto w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2">ID</th>
          <th class="px-4 py-2">Nombre</th>
          <th class="px-4 py-2">Correo</th>
          <th class="px-4 py-2">Rol</th>
          <th class="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id" class="border-t">
          <td class="px-4 py-2">{{ usuario.id }}</td>
          <td class="px-4 py-2">{{ usuario.nombre }}</td>
          <td class="px-4 py-2">{{ usuario.email }}</td>
          <td class="px-4 py-2">{{ usuario.rol }}</td>
          <td class="px-4 py-2">
            <button @click="abrirFormularioEdicion(usuario)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
            <button @click="eliminarUsuario(usuario.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Formulario de edición (oculto por defecto) -->
    <div v-if="usuarioEdicion" class="mt-6 p-4 border bg-gray-100 rounded">
      <h3 class="text-xl font-semibold mb-4">Editar Usuario</h3>
      <form @submit.prevent="guardarEdicion">
        <div class="mb-4">
          <label for="nombre" class="block">Nombre:</label>
          <input type="text" v-model="usuarioEdicion.username" id="nombre" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="email" class="block">Correo:</label>
          <input type="email" v-model="usuarioEdicion.email" id="email" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="first_name" class="block">Primer Nombre:</label>
          <input type="text" v-model="usuarioEdicion.first_name" id="first_name" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="last_name" class="block">Apellidos:</label>
          <input type="text" v-model="usuarioEdicion.last_name" id="last_name" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="birthdate" class="block">Fecha de Nacimiento:</label>
          <input type="date" v-model="usuarioEdicion.birthdate" id="birthdate" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="id_number" class="block">Número de Identificación:</label>
          <input type="text" v-model="usuarioEdicion.id_number" id="id_number" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="phone_number" class="block">Teléfono:</label>
          <input type="text" v-model="usuarioEdicion.phone_number" id="phone_number" class="w-full p-2 border border-gray-300 rounded" required />
        </div>
        <div class="mb-4">
          <label for="rol" class="block">Rol:</label>
          <select v-model="usuarioEdicion.role" id="rol" class="w-full p-2 border border-gray-300 rounded" required>
            <option value="admin">Admin</option>
            <option value="usuario">Usuario</option>
            <option value="organizador">Organizador</option>
          </select>
        </div>
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Guardar Cambios</button>
        <button @click="cancelarEdicion" type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminUsuarios',
  data() {
    return {
      usuarios: [],
      usuarioEdicion: null, // Usuario que está siendo editado
    };
  },
  methods: {
    async cargarUsuarios() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/usuarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        alert('No se pudieron cargar los usuarios.');
      }
    },
    async eliminarUsuario(id) {
      if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3000/api/usuarios/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          alert('No se pudo eliminar el usuario.');
        }
      }
    },
    abrirFormularioEdicion(usuario) {
      this.usuarioEdicion = { ...usuario }; // Copiar los datos del usuario a editar
    },
    async guardarEdicion() {
  try {
    const token = localStorage.getItem('token');

    await axios.put(
      `http://localhost:3000/api/usuarios/${this.usuarioEdicion.id}`,
      this.usuarioEdicion, //  Aquí van los datos a guardar
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Actualizar el usuario en la lista
    const index = this.usuarios.findIndex(u => u.id === this.usuarioEdicion.id);
    if (index !== -1) {
      this.usuarios.splice(index, 1, this.usuarioEdicion);
    }

    this.usuarioEdicion = null; // Limpiar el formulario después de guardar

  } catch (error) {
    console.error('Error al guardar la edición:', error);
    alert('No se pudieron guardar los cambios.');
  }
},
    cancelarEdicion() {
      this.usuarioEdicion = null; // Limpiar el formulario de edición
    }
  },
  mounted() {
    this.cargarUsuarios();
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  text-align: left;
}
</style>
