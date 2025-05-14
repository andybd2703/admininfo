<template>
    <div>
      <h1>Conexión al backend</h1>
      <p v-if="mensaje">Conectado: {{ mensaje }}</p>
      <p v-else>⏳ Esperando respuesta...</p>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
  
  export default {
    data() {
      return {
        mensaje: ''
      };
    },
    mounted() {
      api.get('/ping')
        .then(res => {
          this.mensaje = res.data.message;
        })
        .catch(err => {
          console.error('Error al conectar con backend:', err);
        });
    }
  };
  </script>
  