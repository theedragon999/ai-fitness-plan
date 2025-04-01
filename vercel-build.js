const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists (should be created by the build)
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
}

// Copy index.html to 404.html for SPA routing
fs.copyFileSync(
  path.join('dist', 'index.html'),
  path.join('dist', '404.html')
);

console.log('Created 404.html for SPA fallback routing');