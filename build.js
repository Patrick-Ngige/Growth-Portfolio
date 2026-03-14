const fs = require('fs');
const path = require('path');

console.log('Building KAIROS Portfolio...\n');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy
const files = [
    { src: 'index.html', dest: 'index.html' },
    { src: 'styles.css', dest: 'styles.css' },
    { src: 'script.js', dest: 'script.js' }
];

// Copy files to dist
files.forEach(file => {
    const srcPath = path.join(__dirname, file.src);
    const destPath = path.join(distDir, file.dest);

    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✓ Copied ${file.src} to dist/`);
    } else {
        console.log(`✗ File not found: ${file.src}`);
    }
});

// Copy external assets (fonts, etc.)
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('\n✓ Build completed successfully!');
console.log(`✓ Output directory: ${distDir}\n`);
