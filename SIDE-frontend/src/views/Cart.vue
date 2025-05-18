<template>
  <div class="cart-container">
    <h2>🛒 Tu carrito de eventos</h2>

    <div v-if="loading">Cargando carrito...</div>
    <div v-else>
      <div v-if="carrito.length === 0">
        <p>Tu carrito está vacío 😢</p>
      </div>
      <div v-else>
        <ul>
          <li v-for="item in carrito" :key="item.evento_id" class="cart-item">
            <img :src="getImageUrl(item.imagen)" alt="Imagen evento" class="event-image" />
            <div class="event-info">
              <h3>{{ item.nombre }}</h3>
              <p>Categoría: {{ item.categoria }}</p>
              <p>Cantidad: {{ item.cantidad }}</p>
              <p>Precio unitario: ${{ formatPrice(item.precio_unitario) }}</p>
              <p>Total: ${{ formatPrice(item.total) }}</p>
              <button @click="eliminarItem(item.evento_id, item.categoria)" class="delete-btn">🗑️ Eliminar</button>
            </div>
          </li>
        </ul>

        <div class="cart-total">
          <strong>Total a pagar: ${{ formatPrice(total) }}</strong>
        </div>

        <!-- Botón para comprar -->
        <button
          class="buy-btn"
          @click="irAFormularioCompra"
          :disabled="carrito.length === 0"
        >
          Comprar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarritoVista',
  data() {
    return {
      carrito: [],
      loading: false,
      usuario_id: localStorage.getItem('userId'), // Ajusta según el usuario logueado
    };
  },
  computed: {
    total() {
      return this.carrito.reduce((acc, item) => acc + parseFloat(item.total), 0);
    },
  },
  methods: {
    async fetchCarrito() {
      this.loading = true;
      try {
        const res = await fetch(`http://localhost:3000/api/carrito/${this.usuario_id}`);
        const data = await res.json();
        this.carrito = data;
      } catch (error) {
        console.error('Error al cargar carrito:', error);
      } finally {
        this.loading = false;
      }
    },
    async eliminarItem(evento_id, categoria) {
      try {
        await fetch(`http://localhost:3000/api/carrito/remove/${this.usuario_id}/${evento_id}/${categoria}`, {
          method: 'DELETE',
        });
        this.carrito = this.carrito.filter(item => !(item.evento_id === evento_id && item.categoria === categoria));
      } catch (error) {
        console.error('Error al eliminar el ítem:', error);
      }
    },
    formatPrice(price) {
      return Number(price).toFixed(2);
    },
    getImageUrl(filename) {
      return `http://localhost:3000/uploads/${filename}`;
    },
    irAFormularioCompra() {
      this.$router.push('/formularioCompra');
    }
  },
  mounted() {
    this.fetchCarrito();
  },
};
</script>

<style scoped>
.cart-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}

.event-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.event-info h3 {
  margin: 0 0 0.4rem;
}

.cart-total {
  font-size: 1.3rem;
  text-align: right;
  margin-top: 1rem;
  color: #2a9d8f;
  font-weight: 700;
}

.delete-btn {
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: #e76f51;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.buy-btn {
  margin-top: 1.5rem;
  width: 100%;
  background-color: #2a9d8f;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.buy-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.buy-btn:hover:not(:disabled) {
  background-color: #1f6f6f;
}
</style>
