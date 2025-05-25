<template>
  <div class="cart-container">
    <div class="cart-box">
      <h2 class="cart-title">🛒 Tu carrito de eventos</h2>

      <div v-if="loading" class="loading-message">Cargando carrito...</div>
      <div v-else>
        <div v-if="carrito.length === 0" class="empty-cart-message">
          <p>Tu carrito está vacío 😢</p>
          <router-link to="/" class="continue-shopping-button">
            Volver a la tienda
          </router-link>
        </div>
        <div v-else>
          <ul class="cart-list">
            <li v-for="item in carrito" :key="item.evento_id" class="cart-item">
              <img :src="getImageUrl(item.imagen)" alt="Imagen evento" class="event-image" />
              <div class="event-info">
                <h3>{{ item.nombre }}</h3>
                <p>Categoría: {{ item.categoria }}</p>
                <p>Cantidad: {{ item.cantidad }}</p>
                <p>Precio unitario: {{ formatPrice(item.precio_unitario) }}</p>
                <p>Total: {{ formatPrice(item.total) }}</p>

                <button @click="eliminarItem(item.evento_id, item.categoria)" class="delete-btn">
                  🗑️ Eliminar
                </button>
              </div>
            </li>
          </ul>

          <div class="cart-total">
            <strong>Total a pagar: ${{ formatPrice(total) }}</strong>
          </div>

          <button
            class="btn btn-primary btn-xl buy-button"
            @click="irAFormularioCompra"
            :disabled="carrito.length === 0"
          >
            Proceder al Pago
          </button>
        </div>
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
     formatPrice(valor) {
    
  const num = Number(valor);
  if (isNaN(num)) {
    return 'Precio no disponible';
  }
  return 'COP ' + num.toLocaleString('en-US');},


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
/* Estilos del componente */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

.cart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: url('https://i.imgur.com/6IlTFsk.jpeg'); /* Misma imagen de fondo */
  background-size: cover;
  background-position: center;
  padding: 20px; /* Añadido para espacio en pantallas pequeñas */
  box-sizing: border-box; /* Para que el padding no añada al width */
}

.cart-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 700px; /* Ancho máximo similar al login */
  box-sizing: border-box; /* Para que el padding no añada al width */
}

.cart-title {
  text-align: center;
  color: #173788;
  margin-bottom: 40px;
  font-size: 2.6rem;
  font-weight: bold;
}

.loading-message,
.empty-cart-message {
  text-align: center;
  font-size: 1.5rem;
  color: #555;
  margin-top: 30px;
  padding: 20px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #f0f0f0;
}

.empty-cart-message p {
  margin-bottom: 20px;
}

/* Color para el botón "Volver a la tienda" */
.continue-shopping-button {
  display: inline-block;
  background-color: #173788; /* Color deseado */
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.2rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.continue-shopping-button:hover {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cart-item {
  display: flex;
  align-items: center; /* Alinea los ítems verticalmente */
  gap: 20px; /* Espacio entre imagen y texto */
  margin-bottom: 30px; /* Más espacio entre ítems */
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0; /* Línea más suave */
}

.cart-item:last-child {
  border-bottom: none; /* No hay línea en el último ítem */
}

.event-image {
  width: 150px; /* Más grande */
  height: 100px; /* Más grande */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
}

.event-info {
  flex-grow: 1; /* Permite que la información ocupe el espacio restante */
}

.event-info h3 {
  margin: 0 0 10px; /* Espacio debajo del título */
  color: #173788; /* Color del título */
  font-size: 1.8rem; /* Tamaño de fuente más grande */
}

.event-info p {
  margin: 5px 0;
  color: #555;
  font-size: 1.1rem;
}

.cart-total {
  font-size: 1.8rem; /* Tamaño de fuente más grande */
  text-align: right;
  margin-top: 40px; /* Más espacio arriba */
  color: #173788; /* Color principal */
  font-weight: bold;
  padding-top: 20px;
  border-top: 2px solid #173788; /* Línea de separación para el total */
}

/* Color para el botón "Eliminar" */
.delete-btn {
  margin-top: 15px; /* Más espacio */
  padding: 10px 20px; /* Más padding */
  background: #173788; /* Color deseado */
  color: white;
  border: none;
  border-radius: 8px; /* Bordes redondeados */
  cursor: pointer;
  font-size: 1.1rem; /* Tamaño de fuente más grande */
  transition: background-color 0.3s ease;
}

.delete-btn:hover {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
}

/* Reutilizando estilos de botones de LoginForm para el botón de comprar */
.btn-xl {
  padding: 16px 32px;
  font-size: 1.4rem;
  border-radius: 8px;
}

/* Color para el botón "Proceder al Pago" */
.buy-button {
  background-color: #173788; /* Color deseado */
  color: white;
  border: none;
  width: 100%;
  margin-top: 40px; /* Espacio arriba */
  transition: background-color 0.3s ease;
}

.buy-button:hover:not(:disabled) {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
}

.buy-button:disabled {
  background-color: #cccccc; /* Gris más claro para deshabilitado */
  cursor: not-allowed;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .cart-box {
    padding: 30px;
    margin: 10px;
  }
  .cart-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding-bottom: 20px;
  }
  .event-image {
    width: 100%;
    height: 150px;
  }
  .event-info h3 {
    font-size: 1.5rem;
  }
  .event-info p {
    font-size: 1rem;
  }
  .delete-btn,
  .buy-button,
  .continue-shopping-button {
    font-size: 1rem;
    padding: 10px 15px;
  }
  .cart-total {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cart-box {
    padding: 20px;
  }
  .cart-title {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }
  .event-info h3 {
    font-size: 1.3rem;
  }
  .event-info p {
    font-size: 0.9rem;
  }
  .delete-btn,
  .buy-button,
  .continue-shopping-button {
    font-size: 0.9rem;
    padding: 8px 12px;
  }
  .cart-total {
    font-size: 1.3rem;
  }
}
</style>