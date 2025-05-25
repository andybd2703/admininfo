<template>
  <section class="terms-container">
    <h1>Términos y Condiciones</h1>

    <article class="terms-text">
      <h2>1. Aceptación de los términos</h2>
      <p>
        Al utilizar este sitio web, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo, por favor no uses este sitio.
      </p>

      <h2>2. Uso del sitio</h2>
      <p>
        Te comprometes a usar este sitio de manera legal y respetuosa, sin causar daños ni interferir con su funcionamiento.
      </p>

      <h2>3. Propiedad intelectual</h2>
      <p>
        Todo el contenido del sitio, incluyendo textos, imágenes, logos y diseños, es propiedad de la empresa y está protegido por leyes de propiedad intelectual.
      </p>

      <h2>4. Privacidad</h2>
      <p>
        Respetamos tu privacidad y manejamos tu información personal conforme a nuestra política de privacidad.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        No nos hacemos responsables por daños o pérdidas derivadas del uso del sitio o la información que aquí se proporciona.
      </p>

      <h2>6. Modificaciones</h2>
      <p>
        Podemos cambiar estos términos en cualquier momento, y los cambios serán efectivos desde su publicación en el sitio.
      </p>

      <h2>7. Contacto</h2>
      <p>
        Si tienes dudas sobre estos términos, contáctanos a través de los medios disponibles en el sitio.
      </p>
    </article>
  </section>
</template>

<script>
export default {
  name: 'TerminosYCondiciones',
}
</script>

<style scoped>
.terms-container {
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
