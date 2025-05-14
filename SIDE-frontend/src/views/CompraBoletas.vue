<template>
  <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
    <h2 class="text-2xl font-bold text-purple-700">Compra tus boletas</h2>

    <div>
      <label class="block mb-1 font-medium">Selecciona el evento:</label>
      <select v-model="selectedEvent" class="w-full border rounded px-3 py-2">
        <option disabled value="">-- Elige un evento --</option>
        <option v-for="event in events" :key="event.id" :value="event">
          {{ event.name }} - ${{ event.price }}
        </option>
      </select>
    </div>

    <div>
      <label class="block mb-1 font-medium">Cantidad de boletas:</label>
      <input
        type="number"
        v-model.number="ticketQuantity"
        min="1"
        class="w-full border rounded px-3 py-2"
      />
    </div>

    <div class="text-right">
      <button
        @click="purchaseTickets"
        class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        :disabled="!canPurchase"
      >
        Comprar (${{ totalPrice }})
      </button>
    </div>

    <div v-if="confirmationMessage" class="text-green-600 font-medium">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "TicketPurchase",
  data() {
    return {
      events: [
        { id: 1, name: "Concierto Rock", price: 50 },
        { id: 2, name: "Festival de Jazz", price: 35 },
        { id: 3, name: "Obra de Teatro", price: 20 },
      ],
      selectedEvent: "",
      ticketQuantity: 1,
      confirmationMessage: "",
    };
  },
  computed: {
    totalPrice() {
      return this.selectedEvent && this.ticketQuantity
        ? this.selectedEvent.price * this.ticketQuantity
        : 0;
    },
    canPurchase() {
      return this.selectedEvent && this.ticketQuantity > 0;
    },
  },
  methods: {
    purchaseTickets() {
      if (this.canPurchase) {
        this.confirmationMessage = `¡Compraste ${this.ticketQuantity} boleta(s) para "${this.selectedEvent.name}" por $${this.totalPrice}! 🎉`;
        // Aquí podrías enviar esta info al backend si lo necesitas
      }
    },
  },
};
</script>

<style scoped>
select,
input {
  transition: border-color 0.2s ease;
}
select:focus,
input:focus {
  border-color: #7c3aed;
  outline: none;
}
</style>
