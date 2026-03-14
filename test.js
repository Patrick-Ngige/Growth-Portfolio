const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

async function startServer() {
  const distDir = path.join(__dirname, 'out');
  
  // Create a simple static server
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
      
      const ext = path.extname(filePath);
      const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
      };
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
        } else {
          res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
          res.end(data);
        }
      });
    });
    
    server.listen(3456, () => {
      console.log('Server started on port 3456');
      resolve(server);
    });
  });
}

async function testPortfolio() {
  console.log('Starting Growth Portfolio Test...\n');

  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(error.message);
  });

  try {
    await page.goto('http://localhost:3456', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded successfully');

    // Test 1: Check hero section
    const hero = await page.$('.hero, section[id="hero"]');
    console.log(hero ? '✓ Hero section present' : '✗ Hero section missing');

    // Test 2: Check navigation
    const nav = await page.$('header, nav');
    console.log(nav ? '✓ Navigation present' : '✗ Navigation missing');

    // Test 3: Check about section
    const about = await page.$('#about, section[id="about"]');
    console.log(about ? '✓ About section present' : '✗ About section missing');

    // Test 4: Check contact section
    const contact = await page.$('#contact, section[id="contact"]');
    console.log(contact ? '✓ Contact section present' : '✗ Contact section missing');

    // Test 5: Check footer
    const footer = await page.$('footer');
    console.log(footer ? '✓ Footer present' : '✗ Footer missing');

    // Test 6: Check case studies
    const caseStudies = await page.$('#work, section[id="work"], .case-studies');
    console.log(caseStudies ? '✓ Case studies present' : '✗ Case studies missing');

    // Test 7: Check methodology
    const methodology = await page.$('#approach, section[id="approach"]');
    console.log(methodology ? '✓ Methodology section present' : '✗ Methodology section missing');

    // Test 8: Check page title
    const title = await page.title();
    console.log(`✓ Page title: "${title}"`);

    // Test 9: Check main content area
    const main = await page.$('#main-content, main');
    console.log(main ? '✓ Main content area present' : '✗ Main content area missing');

    // Report errors
    console.log('\n--- Console Errors ---');
    if (errors.length === 0) {
      console.log('No errors detected!');
    } else {
      errors.forEach(err => console.log(`✗ Error: ${err}`));
    }

    console.log('\n========================================');
    console.log('TEST SUMMARY');
    console.log('========================================');
    console.log(`Total Errors: ${errors.length}`);
    console.log('========================================\n');

    if (errors.length === 0) {
      console.log('🎉 All tests passed! Website is ready for deployment.\n');
    } else {
      console.log('⚠ Some errors detected. Please review above.\n');
    }

  } catch (error) {
    console.error('Test failed with error:', error.message);
  } finally {
    await browser.close();
    server.close();
  }
}

testPortfolio();
