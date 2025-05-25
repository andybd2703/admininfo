const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generarFacturaPDF = async (res, orderData) => {
  try {
    // ✅ 1. Declarar primero la función para que esté disponible antes de usarse
    const formatearCOP = (valor) => {
      return Number(valor).toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }) + ' COP';
    };

    // 2. Ruta absoluta a la plantilla
    const rutaPlantilla = path.join(__dirname, '../templates/plantillaFactura.html');

    // 3. Verifica si existe la plantilla
    if (!fs.existsSync(rutaPlantilla)) {
      console.error("❌ Plantilla no encontrada en:", rutaPlantilla);
      return res.status(500).send("Plantilla HTML no encontrada");
    }

    // 4. Lee el HTML base
    let html = fs.readFileSync(rutaPlantilla, 'utf-8');

    // 5. Inserta datos simples
    const fecha = new Date().toLocaleString();
    html = html.replace('{{username}}', orderData.username)
               .replace('{{fecha}}', fecha)
               .replace('{{metodoPago}}', orderData.metodoPago)
               .replace('{{total}}', formatearCOP(orderData.total));

    // 6. Generar tabla de productos
    let filas = '';
    orderData.items.forEach(item => {
      const subtotal = item.cantidad * parseFloat(item.precio_unitario);
      filas += `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>${formatearCOP(item.precio_unitario)}</td>
          <td>${formatearCOP(subtotal)}</td>
        </tr>
      `;
    });

    html = html.replace('<!-- FILAS_PRODUCTOS -->', filas);

    // 7. Genera PDF con Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // 8. Enviar PDF como respuesta
    res.setHeader('Content-disposition', 'attachment; filename=factura.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❗ Error al generar el PDF:', error);
    res.status(500).send('Error al generar la factura');
  }
};

module.exports = { generarFacturaPDF };
