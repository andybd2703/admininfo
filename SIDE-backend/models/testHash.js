const bcrypt = require('bcryptjs');

async function probarHash() {
  const passwordPlano = 'miclave123';
  const hash = await bcrypt.hash(passwordPlano, 10);

  console.log('Hash:', hash);

  const esValido = await bcrypt.compare(passwordPlano, hash);
  console.log('¿Contraseña válida?', esValido);
}

probarHash();
