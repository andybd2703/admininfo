<template>
  <div class="event-detail">
    <section class="event-top">
      <div class="event-card">
        <div class="event-image">
          <img :src="`http://localhost:3000/uploads/${evento.imagen}`" alt="Imagen del evento" />
        </div>

        <div class="event-info">
          <h1>{{ evento.nombre }}</h1>
          <p class="description">{{ evento.descripcion }}</p>

          <div class="actions">
            <button @click="agregarAlCarrito">🛒 Agregar al carrito</button>
            <button @click="toggleFavorito">
              {{ esFavorito ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos' }}
            </button>
          </div>

          <div class="quick-info">
            <p>Arena USC</p>
            <p>{{ formattedFecha }}</p>
            <p>{{ evento.hora }}</p>
            <p>{{ evento.edad_minima }} años</p>
          </div>
        </div>
      </div>
    </section>

    <section class="event-bottom">
      <div class="details">
        <h2>{{ evento.lugar }}</h2>
        <p>{{ formattedFecha }} a las {{ evento.hora }}</p>

        <div class="ticket-prices">
          <h3>Boletos y Precios</h3>
          <table>
            <thead>
              <tr>
                <th>Zona</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Platino</td><td>{{ evento.precio_platino_full }}</td></tr>
              <tr><td>VIP</td><td>{{ evento.precio_vip_full }}</td></tr>
              <tr><td>General</td><td>{{ evento.precio_general_full }}</td></tr>
            </tbody>
          </table>
        </div>

        <div class="ticket-quantity">
  <h3>Selecciona cantidad de boletos</h3>
  <table>
    <thead>
      <tr>
        <th>Categoría</th>
        <th>Cantidad</th>
        <th>Precio Unitario</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Platino</td>
        <td><input type="number" min="0" v-model.number="cantidades.platino" /></td>
        <td>{{ formatCurrency(calcularPrecio('platino')) }}</td>
      </tr>
      <tr>
        <td>VIP</td>
        <td><input type="number" min="0" v-model.number="cantidades.vip" /></td>
        <td>{{ formatCurrency(calcularPrecio('vip')) }}</td>
      </tr>
      <tr>
        <td>General</td>
        <td><input type="number" min="0" v-model.number="cantidades.general" /></td>
        <td>{{ formatCurrency(calcularPrecio('general')) }}</td>
      </tr>
    </tbody>
  </table>
</div>


        <div class="faq">
          <h3>Preguntas Frecuentes</h3>
          <ul>
            <li><strong>Edad mínima:</strong> {{ evento.edad_minima }} años</li>
            <li><strong>¿Se venderá comida?</strong> {{ evento.vender_comida ? 'Sí' : 'No' }}</li>
            <li><strong>¿Bebidas alcohólicas?</strong> {{ evento.vender_bebidas_alcoholicas ? 'Sí' : 'No' }}</li>
            <li><strong>¿Accesible para personas con movilidad reducida?</strong> Sí</li>
          </ul>
        </div>
      </div>

      <aside class="visuals">
        <div>
          <h3>Mapa de sillas</h3>
          <img src="https://i.imgur.com/NF8QZZ6.jpeg" alt="Mapa Arena USC" />
        </div>
        <div>
          <h3>Vista previa</h3>
          <img src="https://i.imgur.com/SK3FE5g.jpeg" alt="Vista Arena USC" />
        </div>
      </aside>
    </section>

    <footer class="final-message">
      <p>🎉 ¡Una experiencia mágica te espera! No te lo pierdas. 🎉</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  data() {
    return {
      evento: {},
      esFavorito: false,
      cantidades: {
        platino: 0,
        vip: 0,
        general: 0
      }
    };
  },
  computed: {
    formattedFecha() {
      return this.evento.fecha
        ? format(new Date(this.evento.fecha), 'dd MMMM yyyy', { locale: es })
        : '';
    }
  },
  created() {
    const id = this.$route.params.id;
    this.obtenerEvento(id);
  },
  methods: {
    async obtenerEvento(id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/events/${id}`);
        this.evento = response.data;
        this.verificarFavorito();
      } catch (error) {
        console.error("Error al obtener evento:", error);
      }
    },
    async verificarFavorito() {
      try {
        const usuarioId = localStorage.getItem('userId');
        const eventoId = this.evento.id;
        const res = await axios.get(`http://localhost:3000/api/favoritos/verificar/${usuarioId}/${eventoId}`);
        this.esFavorito = res.data.isFavorito;
      } catch (error) {
        console.error("Error al verificar favorito:", error);
      }
    },
    async toggleFavorito() {
      const usuarioId = localStorage.getItem('userId');
      const eventoId = this.evento.id;

      try {
        if (this.esFavorito) {
          await axios.delete(`http://localhost:3000/api/favoritos/remove`, {
            data: { usuario_id: usuarioId, evento_id: eventoId }
          });
        } else {
          await axios.post(`http://localhost:3000/api/favoritos/add`, {
            usuario_id: usuarioId, evento_id: eventoId
          });
        }
        this.esFavorito = !this.esFavorito;
      } catch (error) {
        console.error("Error al cambiar favorito:", error);
      }
    },
    async agregarAlCarrito() {
  const usuarioId = localStorage.getItem('userId');
  if (!usuarioId) {
    alert('Debes iniciar sesión para agregar al carrito');
    return;
  }

  const peticiones = [];

  for (const categoria in this.cantidades) {
    const cantidad = this.cantidades[categoria];
    if (cantidad > 0) {
      for (let i = 0; i < cantidad; i++) {
        peticiones.push(
          axios.post('http://localhost:3000/api/carrito/add', {
            usuario_id: usuarioId,
            evento_id: this.evento.id,
            categoria: categoria
          })
        );
      }
    }
  }

  if (peticiones.length === 0) {
    alert('Selecciona al menos una cantidad de boletos para agregar al carrito');
    return;
  }

  try {
    await Promise.all(peticiones);
    alert('¡Boletos agregados al carrito correctamente!');
    this.cantidades = { platino: 0, vip: 0, general: 0 };
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar al carrito.');
  }
}

,
    calcularPrecio(categoria) {
  const cantidad = this.cantidades[categoria];
  let base = 0;

  if (categoria === 'platino') base = this.evento.precio_platino_full;
  if (categoria === 'vip') base = this.evento.precio_vip_full;
  if (categoria === 'general') base = this.evento.precio_general_full;

  // Aplicar descuento por cantidad
  const precioUnitario = cantidad >= 5 ? base * 0.9 : base;

  return cantidad * precioUnitario; // Precio total
},

formatCurrency(value) {
    if (typeof value !== "number") return value;
    return '$' + value.toFixed(2);
  }
    
  }
  

};
</script>

<style scoped>
.event-detail {
  padding: 20px;
  background-color: #fafafa;
  font-family: 'Segoe UI', sans-serif;
}

.event-top {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.event-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.1);
  padding: 20px;
  max-width: 700px;
  width: 100%;
  text-align: center;
}

.event-image img {
  width: 100%;
  border-radius: 10px;
}

.event-info h1 {
  font-size: 1.8rem;
  margin-top: 15px;
}

.description {
  margin: 15px 0;
  font-size: 1rem;
  color: #444;
}

.actions button {
  margin: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  background-color: #663399;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.actions button:hover {
  background-color: #50257c;
}

.quick-info {
  margin-top: 10px;
  color: #666;
  font-size: 0.9rem;
}

.event-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.details {
  flex: 2;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

.visuals {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.visuals img {
  width: 100%;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #eee;
}

.ticket-quantity input {
  margin-left: 10px;
  width: 60px;
}

.faq ul {
  list-style-type: none;
  padding: 0;
}

.faq li {
  margin: 8px 0;
}

.final-message {
  margin-top: 40px;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
  color: #444;
}
.ticket-quantity table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.ticket-quantity th,
.ticket-quantity td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}

.ticket-quantity input {
  width: 60px;
}

</style>
