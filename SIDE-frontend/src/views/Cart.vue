<template>
    <div class="order-details-container">
      <div class="order-details-header">
        <h2 class="order-details-title">DETALLES DE TU PEDIDO</h2>
      </div>
      <div class="modification-success">
        <p class="success-message">
          <span class="new-text">Nueva</span> <span class="modification-text">Modificación agregada con éxito</span>
        </p>
        <p class="added-item">1 entrada añadida a tu cesta</p>
      </div>
      <div class="event-info-box">
        <div class="event-info-left">
          <h3 class="event-title">LA BELLA Y LA BESTIA - EL ESPECTÁCULO</h3>
          <div class="quick-info">
            <div class="info-item">
              <img src="https://i.imgur.com/80c539j.png" alt="Lugar" class="info-icon"> <p class="info-text">Lugar: Arena USC</p>
            </div>
            <div class="info-item">
              <img src="https://i.imgur.com/h1x8y8T.png" alt="Fecha" class="info-icon"> <p class="info-text">Fecha: 15 de junio</p>
            </div>
            <div class="info-item">
              <img src="https://i.imgur.com/m7nF2G8.png" alt="Hora" class="info-icon"> <p class="info-text">Hora: 4:00pm</p>
            </div>
            <div class="info-item">
              <img src="https://i.imgur.com/w9G337p.png" alt="Edad mínima" class="info-icon"> <p class="info-text">Edad mínima: +5 años</p>
            </div>
          </div>
        </div>
        <div class="event-info-right">
          <img src="https://i.imgur.com/T64dxjF.png" alt="Imagen del evento" class="event-image">
        </div>
      </div>
      <div class="cart-item-detail">
        <p class="item-name">1 Entrada Platea</p>
        <button class="remove-button">X Borrar</button>
      </div>
      <div class="order-summary">
        <p class="total-label">Valor a pagar</p>
        <p class="total-price">$61.000</p>
      </div>
      <div class="order-actions">
        <button class="action-button">Inicio</button>
        <button class="action-button download-button">
          <img src="https://i.imgur.com/bVbS61R.png" alt="Descargar" class="download-icon"> Descargar
        </button>
        <button class="action-button buy-now-button">Comprar ahora</button>
      </div>
    </div>
  </template>
  
  <style scoped>
  .order-details-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 700px;
    margin: 20px auto;
    font-family: sans-serif;
    color: #333;
  }
  
  .order-details-header {
    border-bottom: 2px solid #ddd;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
  
  .order-details-title {
    color: #173788;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }
  
  .modification-success {
    background-color: #e6ffe6;
    color: #228B22;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }
  
  .success-message {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .new-text {
    color: #008000;
  }
  
  .modification-text {
    color: #006400;
  }
  
  .added-item {
    color: #555;
  }
  
  .event-info-box {
    background: linear-gradient(to right, #191c26 70%, rgba(25, 28, 38, 0.6));
    color: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .event-info-left {
    flex-grow: 1;
  }
  
  .event-title {
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .quick-info {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 20px;
    font-size: 0.85rem;
  }
  
  .info-item {
    display: flex;
    align-items: center;
  }
  
  .info-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
  
  .info-text {
    color: #eee;
  }
  
  .event-info-right {
    width: 30%;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .event-image {
    width: 100%;
    display: block;
    object-fit: cover;
    height: auto;
  }
  
  .cart-item-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 10px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    margin-bottom: 15px;
    font-size: 0.95rem;
  }
  
  .item-name {
    font-weight: bold;
  }
  
  .remove-button {
    background: none;
    border: none;
    color: #dc3545;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .remove-button:hover {
    color: #c82333;
  }
  
  .order-summary {
    display: flex;
    justify-content: space-between;
    padding: 15px 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    margin-bottom: 20px;
    font-size: 1rem;
  }
  
  .total-label {
    font-weight: bold;
  }
  
  .total-price {
    color: #28a745;
    font-weight: bold;
  }
  
  .order-actions {
    display: flex;
    gap: 10px;
  }
  
  .action-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    flex-grow: 1;
    text-align: center;
    text-decoration: none;
  }
  
  .action-button:hover {
    background-color: #0056b3;
  }
  
  .download-button {
    background-color: #6c757d;
  }
  
  .download-button:hover {
    background-color: #5a6268;
  }
  
  .download-icon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
  }
  
  .buy-now-button {
    background-color: #28a745;
  }
  
  .buy-now-button:hover {
    background-color: #1e7e34;
  }
  </style>
  
  <script>
  export default {
    name: 'OrderDetails',
    data() {
      return {
        // Aquí puedes añadir la lógica para manejar la cantidad, la eliminación de items, etc.
      };
    },
    methods: {
      // Métodos para interactuar con el carrito
    }
  };
  </script>