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
            <div class="info-item">📍 Arena USC</div>
            <div class="info-item">📅 {{ formattedFecha }}</div>
            <div class="info-item">⏰ {{ evento.hora }}</div>
            <div class="info-item">👶 {{ evento.edad_minima }} años</div>
          </div>
        </div>
      </div>


      <section>
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
              <tr><td>Platino</td><td>{{ formatCurrency(evento.precio_platino_full) }}</td></tr>
              <tr><td>VIP</td><td>{{ formatCurrency(evento.precio_vip_full) }}</td></tr>
              <tr><td>General</td><td>{{ formatCurrency(evento.precio_general_full) }}</td></tr>
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
      </section>
    </section>

    <section class="event-bottom">


      <aside class="visuals">
        <div class="image-card">
          <h3>📍 Mapa de Sillas</h3>
          <img src="https://i.imgur.com/NF8QZZ6.jpeg" alt="Mapa Arena USC" />
        </div>
        <div class="image-card">
          <h3>🎥 Vista Previa del Escenario</h3>
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
    },

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

  const itemsAAgregar = [];

  for (const categoria in this.cantidades) {
    const cantidad = this.cantidades[categoria];
    if (cantidad > 0) {
      itemsAAgregar.push({
        usuario_id: usuarioId,
        evento_id: this.evento.id,
        categoria,
        cantidad
      });
    }
  }

  if (itemsAAgregar.length === 0) {
    alert('Selecciona al menos una cantidad de boletos para agregar al carrito');
    return;
  }

  try {
    await axios.post('http://localhost:3000/api/carrito/add-multiple', itemsAAgregar);
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

  return cantidad * base; // Solo multiplicación simple, nada más
},


formatCurrency(valor) {
 const num = Number(valor);
  if (isNaN(num)) {
    return 'Precio no disponible';
  }
  return 'COP ' + num.toLocaleString('en-US');
}
    
  }
  

};
</script>

<style scoped>
.event-detail {
  padding: 2rem;
  background: #e6ecf5;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.event-top {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
}

.event-card {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 8px 24px rgba(102, 51, 153, 0.15);
  padding: 2rem;
  max-width: 720px;
  width: 100%;
  text-align: center;
}

.quick-info {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  color: #0332cd;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}



.event-image img {
  width: 100%;
  border-radius: 1rem;
  object-fit: cover;
}

.event-info h1 {
  font-size: 2.5rem;
  color: #001f5c;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.event-info h2 {
  font-size: 1.5rem;
  color: #777;
  margin-top: 0;
}
.event-info {
  background-color: #faf6ff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(80, 37, 124, 0.1);
  margin-bottom: 1.5rem;
}

.event-info {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



.description {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  background-color: #002b80;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.actions button:hover {
  background-color: #001f5c;
}

.quick-info {
  margin-top: 1.5rem;
  color: #777;
  font-size: 1rem;
}

.event-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.details {
  flex: 2;
  background: #fff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.details h2 {
  color: #663399;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.details h3 {
  margin-top: 1.5rem;
  color: #333;
}

.visuals {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
}

.image-card {
  flex: 1 1 300px;
  max-width: 520px;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-card:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 24px rgba(102, 51, 153, 0.25);
}

.image-card h3 {
  text-align: center;
  font-size: 1.1rem;
  color: #663399;
  margin-bottom: 0.75rem;
}

.image-card img {
  width: 100%;
  border-radius: 0.75rem;
  max-height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-card img:hover {
  transform: scale(1.03);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 43, 128, 0.1);
}

th {
  background-color: #002b80;
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  text-align: center;
  font-size: 1rem;
}

td {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.95rem;
  border-bottom: 1px solid #d3dff5;
}

tbody tr:nth-child(even) {
  background-color: #e6ecfa;
}

.ticket-quantity input {
  width: 60px;
  padding: 0.4rem;
  border-radius: 0.4rem;
  border: 1px solid #002b80;
  text-align: center;
}

.faq ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.faq li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.final-message {
  margin-top: 3rem;
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: #50257c;
  background-color: #ede9f3;
  padding: 1rem;
  border-radius: 1rem;
}

/* Responsivo */
@media (max-width: 768px) {
  .visuals {
    flex-direction: column;
    align-items: center;
  }
}
</style>

