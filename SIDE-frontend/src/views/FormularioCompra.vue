<template>
  <div class="compra-container">
    <h1>Confirmar Compra</h1>

    <section class="resumen-compra" v-if="items.length">
      <h2>Resumen de la compra</h2>
      <ul>
        <li v-for="(item, index) in items" :key="index">
          {{ item.nombre }} - {{ item.cantidad }} x ${{ formatoPrecio(item.precio_unitario) }} = ${{ formatoPrecio(item.cantidad * item.precio_unitario) }}
        </li>
      </ul>
      <p class="total"><strong>Total: ${{ formatoPrecio(total) }}</strong></p>
    </section>
    <section v-else>
      <p>No hay productos en el carrito.</p>
    </section>

    <form @submit.prevent="submitCompra" class="form-pago" v-if="items.length">
      <h2>Opciones de pago</h2>

      <label>
        <input
          type="radio"
          value="tarjeta"
          v-model="metodoPago"
          required
        />
        Tarjeta de crédito/débito
      </label>

      <label>
        <input
          type="radio"
          value="paypal"
          v-model="metodoPago"
          required
        />
        PayPal
      </label>

      <label>
        <input
          type="radio"
          value="transferencia"
          v-model="metodoPago"
          required
        />
        Transferencia bancaria
      </label>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Procesando...' : 'Confirmar compra' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">
      ¡Compra realizada con éxito! Tu factura se descargará automáticamente.
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmarCompra',
  data() {
    return {
      items: [],
      
      metodoPago: '',
      loading: false,
      error: '',
      success: false,
      usuario_id: localStorage.getItem('userId'), // ID usuario
    }
  },
  computed: {
    total() {
      return this.items.reduce((sum, item) => sum + item.cantidad * Number(item.precio_unitario), 0);
    }
  },
  methods: {
    formatoPrecio(valor) {
      const numero = Number(valor);
      return isNaN(numero) ? '0.00' : numero.toFixed(2);
    },
    async submitCompra() {
  this.error = '';
  this.success = false;

  if (!this.metodoPago) {
    this.error = 'Por favor, selecciona un método de pago.';
    return;
  }

  this.loading = true;

  try {
    const username = localStorage.getItem('usuario'); // o el nombre que tengas

    const orderData = {
      username,
      items: this.items,
      total: this.total,
      metodoPago: this.metodoPago
    };

    const response = await fetch('http://localhost:3000/api/compra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Error procesando la compra');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'factura.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    this.success = true;
  } catch (err) {
    this.error = err.message || 'Error inesperado';
  } finally {
    this.loading = false;
  }
}

  },
  async mounted() {
    try {
      const res = await fetch(`http://localhost:3000/api/carrito/${this.usuario_id}`);
      if (!res.ok) throw new Error('Error al obtener el carrito');
      const data = await res.json();
      this.items = data;
    } catch (err) {
      this.error = err.message;
    }
  }
}
</script>
<style scoped>
.compra-container {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1.8rem 2rem;
  background: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.4rem;
}

h2 {
  font-weight: 600;
  color: #34495e;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.3rem;
}

.resumen-compra ul {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 1rem;
}

.resumen-compra li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e1e4e8;
  font-size: 1rem;
}

.total {
  font-size: 1.25rem;
  text-align: right;
  color: #27ae60;
  margin-top: 1rem;
  font-weight: 700;
}

.form-pago {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dcdcdc;
}

label {
  display: block;
  margin-bottom: 0.8rem;
  font-size: 1rem;
  cursor: pointer;
  color: #2c3e50;
  user-select: none;
}

input[type="radio"] {
  margin-right: 0.6rem;
  accent-color: #3498db;
  cursor: pointer;
}

button[type="submit"] {
  display: block;
  width: 100%;
  padding: 0.8rem 0;
  margin-top: 1.4rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  background: #2980b9;
}

button[type="submit"]:disabled {
  background: #a0c4db;
  cursor: not-allowed;
}

.error {
  margin-top: 1.5rem;
  padding: 0.9rem;
  background-color: #e74c3c;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
}

.success {
  margin-top: 1.5rem;
  padding: 0.9rem;
  background-color: #27ae60;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
  user-select: none;
}
</style>
