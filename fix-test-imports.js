const fs = require('fs');
const path = require('path');

// Directorio de tests
const testsDir = path.join(__dirname, 'tests');

// Función para corregir las rutas de importación en un archivo
function fixImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corregir rutas de importación
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/src\//g, '../src/');
    content = content.replace(/\.\.\/\.\.\/\.\.\/src\//g, '../src/');
    content = content.replace(/\.\.\/\.\.\/src\//g, '../src/');
    
    // Guardar el archivo con las rutas corregidas
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {}
}

// Procesar todos los archivos de prueba
fs.readdirSync(testsDir).forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    fixImports(path.join(testsDir, file));
  }
});