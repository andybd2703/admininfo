<template>
  <section class="privacy-container">
    <h1>Política de Privacidad</h1>

    <article class="privacy-text">
      <h2>1. Información que recolectamos</h2>
      <p>
        Recopilamos datos personales como nombre, correo electrónico y otros detalles que nos proporcionas cuando te registras o usas nuestros servicios.
      </p>

      <h2>2. Uso de la información</h2>
      <p>
        Utilizamos tu información para mejorar la experiencia en el sitio, personalizar contenido y enviarte actualizaciones relevantes.
      </p>

      <h2>3. Compartir datos</h2>
      <p>
        No vendemos ni alquilamos tu información a terceros. Podemos compartir datos con proveedores de servicios que nos ayudan a operar la plataforma, siempre bajo estrictas medidas de confidencialidad.
      </p>

      <h2>4. Seguridad</h2>
      <p>
        Implementamos medidas razonables para proteger tus datos contra accesos no autorizados, pérdida o alteración.
      </p>

      <h2>5. Tus derechos</h2>
      <p>
        Puedes acceder, corregir o eliminar tus datos en cualquier momento contactándonos directamente.
      </p>

      <h2>6. Cambios en esta política</h2>
      <p>
        Nos reservamos el derecho de actualizar esta política cuando sea necesario. Los cambios serán publicados aquí y entrarán en vigor inmediatamente.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Si tienes preguntas o inquietudes sobre cómo manejamos tu información, contáctanos en soporte@sideusc.com.
      </p>
    </article>
  </section>
</template>

<script>
export default {
  name: 'PoliticaDePrivacidad',
}
</script>

<style scoped>
.privacy-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #fafafa;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.2rem;
  color: #222;
}

h2 {
  margin-top: 1.5rem;
  font-size: 1.3rem;
  color: #555;
}

p {
  line-height: 1.5;
  margin-top: 0.5rem;
}
</style>
