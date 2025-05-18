const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generarFacturaPDF = async (res, orderData) => {
  try {
    // 1. Ruta absoluta a la plantilla
    const rutaPlantilla = path.join(__dirname, '../templates/plantillaFactura.html');

    // 2. Verifica si existe la plantilla
    if (!fs.existsSync(rutaPlantilla)) {
      console.error("❌ Plantilla no encontrada en:", rutaPlantilla);
      return res.status(500).send("Plantilla HTML no encontrada");
    }

    // 3. Lee el HTML base
    let html = fs.readFileSync(rutaPlantilla, 'utf-8');

    // 4. Inserta datos simples
    const fecha = new Date().toLocaleString();
    html = html.replace('{{username}}', orderData.username)
               .replace('{{fecha}}', fecha)
               .replace('{{metodoPago}}', orderData.metodoPago)
               .replace('{{total}}', orderData.total);

    // 5. Generar tabla de productos
    let filas = '';
    orderData.items.forEach(item => {
      const subtotal = item.cantidad * parseFloat(item.precio_unitario);
      filas += `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>$${Number(item.precio_unitario).toFixed(2)}</td>
          <td>$${subtotal.toFixed(2)}</td>
        </tr>
      `;
    });

    html = html.replace('<!-- FILAS_PRODUCTOS -->', filas);

    // 6. Genera PDF con Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'load' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    // 7. Enviar PDF como respuesta
    res.setHeader('Content-disposition', 'attachment; filename=factura.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❗ Error al generar el PDF:', error);
    res.status(500).send('Error al generar la factura');
  }
};

module.exports = { generarFacturaPDF };
