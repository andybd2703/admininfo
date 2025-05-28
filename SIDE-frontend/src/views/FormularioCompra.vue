<template>
  <div class="page-wrapper">
    <div class="main-content-box">
      <h1 class="page-title">🛒 Confirmar Compra</h1>

      <section class="summary-section" v-if="items.length">
        <h2 class="section-title"><i class="fas fa-receipt"></i> Resumen de la compra</h2>
        <ul class="item-list">
          <li v-for="(item, index) in items" :key="index" class="item-list-item">
            <span class="item-name">{{ item.nombre }}</span> -
            <span class="item-quantity">{{ item.cantidad }}</span> x
            <span class="item-price">${{ formatoPrecio(item.precio_unitario) }}</span> =
            <span class="item-subtotal">${{ formatoPrecio(item.cantidad * item.precio_unitario) }}</span>
          </li>
        </ul>
        <p class="total-price">
          <strong>Total: ${{ formatoPrecio(total) }}</strong>
        </p>
      </section>
      <section v-else class="empty-cart-message">
        <p><i class="fas fa-shopping-cart"></i> Tu carrito está vacío. ¡Añade algunos eventos!</p>
        <router-link to="/eventos" class="action-button">
          Explorar Eventos
        </router-link>
      </section>

      <form @submit.prevent="submitCompra" class="payment-form" v-if="items.length">
        <h2 class="section-title"><i class="fas fa-wallet"></i> Opciones de pago</h2>

        <div class="radio-group">
          <label class="radio-label">
            <input
              type="radio"
              value="tarjeta"
              v-model="metodoPago"
              required
            />
            <span class="custom-radio"></span>
            <i class="fas fa-credit-card icon-payment"></i> Tarjeta de crédito/débito
          </label>

          <label class="radio-label">
            <input
              type="radio"
              value="paypal"
              v-model="metodoPago"
              required
            />
            <span class="custom-radio"></span>
            <i class="fab fa-paypal icon-payment"></i> PayPal
          </label>

          <label class="radio-label">
            <input
              type="radio"
              value="transferencia"
              v-model="metodoPago"
              required
            />
            <span class="custom-radio"></span>
            <i class="fas fa-university icon-payment"></i> Transferencia bancaria
          </label>
        </div>

        <button type="submit" :disabled="loading" class="confirm-button">
          <i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'"></i>
          {{ loading ? 'Procesando Compra...' : 'Confirmar Compra' }}
        </button>
      </form>

      <div v-if="error" class="message-box error-message">
        <i class="fas fa-times-circle"></i> {{ error }}
      </div>
      <div v-if="success" class="message-box success-message">
        <i class="fas fa-check-circle"></i> ¡Compra realizada con éxito! Tu factura se descargará automáticamente.
      </div>
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
      usuario_id: localStorage.getItem('userId'),  
    }
  },
  computed: {
    total() {
      return this.items.reduce((sum, item) => sum + item.cantidad * Number(item.precio_unitario), 0);
    }
  },
  methods: {
         formatoPrecio(valor) {
    
  const num = Number(valor);
  if (isNaN(num)) {
    return 'Precio no disponible';
  }
  return 'COP ' + num.toLocaleString('en-US');},
    async submitCompra() {
      this.error = '';
      this.success = false;

      if (!this.metodoPago) {
        this.error = 'Por favor, selecciona un método de pago.';
        return;
      }

      this.loading = true;

      try {
        const username = localStorage.getItem('usuario'); 
        const token = localStorage.getItem('token'); 
        const orderData = {
          username,
          items: this.items,
          total: this.total,
          metodoPago: this.metodoPago
        };

        const response = await fetch('http://localhost:3000/api/compra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(orderData)
        });

        if (!response.ok) {
  const contentType = response.headers.get('Content-Type');
  let errorMessage = 'Error procesando la compra';

  if (contentType && contentType.includes('application/json')) {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } else {
    const text = await response.text();
    errorMessage = text || errorMessage;
  }

  throw new Error(errorMessage);
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
       
        this.items = [];
      } catch (err) {
        this.error = err.message || 'Error inesperado al procesar la compra.';
      } finally {
        this.loading = false;
      }
    }
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token'); 
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`http://localhost:3000/api/carrito/${this.usuario_id}`, { headers });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al obtener el carrito.');
      }
      const data = await res.json();
      this.items = data;
      if (this.items.length === 0 && !this.error && !this.success) {
      }
    } catch (err) {
      this.error = err.message || 'Error al cargar los productos del carrito.';
      this.items = [];
    }
  }
}
</script>

<style scoped>
/* Importa Font Awesome para los íconos */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

/* Contenedor principal de la página, replicando el fondo suave */
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinea arriba para que el contenido fluya */
  min-height: 100vh; /* Ocupa al menos toda la altura de la ventana */
  padding: 40px 20px; /* Padding para el contenido general */
  background-color: #e6ecf5; /* Un color de fondo suave */
  box-sizing: border-box;
}

/* Caja principal que contiene el formulario/resumen */
.main-content-box {
  background-color: rgba(255, 255, 255, 0.95); /* Blanco semitransparente para la caja */
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
  width: 100%;
  max-width: 600px; /* Ancho máximo para el contenido */
  box-sizing: border-box;
}

/* Título de la página */
.page-title {
  text-align: center;
  color: #173788; /* Color principal */
  margin-bottom: 40px;
  font-size: 2.5rem; /* Un poco más grande */
  font-weight: bold;
}

/* Estilos de las secciones (resumen, pago) */
.summary-section,
.payment-form {
  margin-bottom: 30px; /* Espacio entre secciones */
  padding-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
}

.summary-section:last-of-type,
.payment-form:last-of-type {
  border-bottom: none; /* Sin borde en la última sección */
  padding-bottom: 0;
  margin-bottom: 0;
}

.section-title {
  font-weight: bold;
  color: #173788; /* Color principal */
  margin-bottom: 20px;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #173788; /* Línea debajo del título */
  padding-bottom: 8px;
}

.section-title i {
  margin-right: 12px;
  font-size: 1.5rem;
  color: #173788;
}

/* Lista de items del carrito */
.item-list {
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
  background-color: #fcfcfc;
  border-radius: 8px;
  overflow: hidden; /* Para border-radius en el primer/último item */
}

.item-list-item {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  color: #444;
}

.item-list-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: bold;
  flex-grow: 1;
}

.item-quantity,
.item-price,
.item-subtotal {
  margin-left: 10px;
  font-weight: 500;
}

.item-subtotal {
    color: #173788; /* Color principal para el subtotal */
    font-weight: bold;
}

/* Total de la compra */
.total-price {
  font-size: 1.5rem;
  text-align: right;
  color: #173788; /* Color principal */
  margin-top: 25px;
  font-weight: bold;
  padding-top: 15px;
  border-top: 2px dashed #e0e0e0; /* Línea punteada para el total */
}

.total-price strong {
  font-size: 1.8rem;
}


/* Mensaje de carrito vacío */
.empty-cart-message {
  text-align: center;
  font-size: 1.3rem;
  color: #555;
  margin-top: 30px;
  padding: 30px;
  border: 1px dashed #ccc;
  border-radius: 12px;
  background-color: #fdfdfd;
}

.empty-cart-message i {
  margin-right: 10px;
  color: #173788;
}

.empty-cart-message .action-button {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  background-color: #173788;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.empty-cart-message .action-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}


/* Opciones de pago (radio buttons) */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espacio entre las opciones de radio */
}

.radio-label {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
  padding: 10px 15px;
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.radio-label:hover {
  background-color: #f2f2f2;
  border-color: #173788;
}

input[type="radio"] {
  /* Ocultar el radio button nativo */
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* Estilo del radio button personalizado */
.custom-radio {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  margin-right: 15px;
  position: relative;
  transition: border-color 0.2s ease;
  flex-shrink: 0; /* Evita que el radio button se encoja */
}

.custom-radio::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #173788; /* Color de relleno */
  transform: translate(-50%, -50%) scale(0); /* Inicialmente oculto */
  transition: transform 0.2s ease;
}

/* Cuando el radio button está checked */
input[type="radio"]:checked + .custom-radio {
  border-color: #173788; /* Borde al estar seleccionado */
}

input[type="radio"]:checked + .custom-radio::after {
  transform: translate(-50%, -50%) scale(1); /* Escala para mostrar el relleno */
}

.icon-payment {
  margin-right: 10px;
  color: #173788;
  font-size: 1.3rem;
}


/* Botón de confirmar compra */
.confirm-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 15px 30px;
  margin-top: 30px;
  background-color: #173788; /* Color principal */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.confirm-button:hover:not(:disabled) {
  background-color: #0056b3; /* Un azul más oscuro para el hover */
  transform: translateY(-2px);
}

.confirm-button:disabled {
  background-color: #a0c4db; /* Color más claro para deshabilitado */
  cursor: not-allowed;
  opacity: 0.8;
}

.confirm-button i {
  margin-right: 10px;
  font-size: 1.4rem;
}

/* Mensajes de error/éxito */
.message-box {
  margin-top: 25px;
  padding: 18px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.message-box i {
  margin-right: 12px;
  font-size: 1.3rem;
}

.error-message {
  background-color: #ffebeb; /* Rojo suave */
  color: #dc3545; /* Rojo de error */
  border: 1px solid #dc3545;
}

.success-message {
  background-color: #e6ffe6; /* Verde suave */
  color: #28a745; /* Verde de éxito */
  border: 1px solid #28a745;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .main-content-box {
    padding: 30px;
  }
  .page-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
  .section-title i {
    font-size: 1.3rem;
  }
  .item-list-item {
    font-size: 0.95rem;
    padding: 12px 15px;
  }
  .total-price {
    font-size: 1.3rem;
  }
  .total-price strong {
    font-size: 1.6rem;
  }
  .radio-label {
    font-size: 1rem;
    padding: 8px 12px;
  }
  .custom-radio {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
  .custom-radio::after {
    width: 9px;
    height: 9px;
  }
  .icon-payment {
    font-size: 1.1rem;
    margin-right: 8px;
  }
  .confirm-button {
    font-size: 1.1rem;
    padding: 12px 25px;
  }
  .confirm-button i {
    font-size: 1.2rem;
  }
  .message-box {
    font-size: 1rem;
    padding: 15px;
  }
  .message-box i {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .main-content-box {
    padding: 20px;
  }
  .page-title {
    font-size: 1.8rem;
    margin-bottom: 25px;
  }
  .section-title {
    font-size: 1.4rem;
  }
  .section-title i {
    font-size: 1.2rem;
  }
  .item-list-item {
    flex-wrap: wrap; /* Permite que los elementos se envuelvan */
    justify-content: flex-start;
    gap: 5px 10px;
  }
  .item-name {
    width: 100%;
    margin-bottom: 5px;
  }
  .item-quantity, .item-price, .item-subtotal {
    margin-left: 0;
  }
  .total-price {
    font-size: 1.2rem;
  }
  .total-price strong {
    font-size: 1.5rem;
  }
  .confirm-button {
    font-size: 1rem;
    padding: 10px 20px;
  }
}
</style>