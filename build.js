import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const filesToCopy = [
  'index.html',
  'home.html',
  'dashboard.html',
  'sell.html',
  'purchase.html',
  'sales_book.html',
  'purchase_book.html',
  'sales_return.html',
  'purchase_return.html',
  'order_book.html',
  'due_book.html',
  'expenses_book.html',
  'cashbox.html',
  'stock_book.html',
  'product_list.html',
  'expire_product.html',
  'estimate.html',
  'contacts.html',
  'barcode_gen.html',
  'business_report.html',
  'reports.html',
  'notes.html',
  'printer.html',
  'settings.html',
  'unit_admin.html',
  'app_access.html',
  'header.html',
  'bottom_nav.html',
  'firebase_config.js',
  'invoice_kit.js',
  'sw.js',
  'manifest.json',
  'icon-192x192.png',
  'icon-512x512.png',
  'icon.svg',
  'logo.svg',
  'logo-dark.svg',
  'favicon.png',
  '_headers',
  '_redirects'
];

for (const file of filesToCopy) {
  const srcPath = path.join(__dirname, file);
  const destPath = path.join(distDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} -> dist/`);
  }
}

console.log('Build completed successfully!');
