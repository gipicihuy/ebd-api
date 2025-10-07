// FILE: server.js (UPDATED with Downloader Routes)

import express from 'express';
// Tambahkan path untuk mengelola lokasi file
import path from 'path'; 
import { fileURLToPath } from 'url';

// Helper untuk mendapatkan __dirname di mode ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Import Rucoy Routes yang sudah ada
import rucoyRoutes from './src/routes/rucoy.routes.js'; 
// 2. Import Downloader Routes yang BARU
import downloaderRoutes from './src/routes/downloader.routes.js'; 

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARE
app.use(express.json());

// 1. ROUTE UTAMA untuk melayani file HTML
// Asumsi tester.html adalah nama file yang Anda gunakan di root folder.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tester.html')); 
});

// 2. MOUNT ENDPOINT Rucoy API
// Semua request ke /api/rucoy/* akan ditangani oleh rucoyRoutes
app.use('/api/rucoy', rucoyRoutes);

// 3. MOUNT ENDPOINT Downloader API
// Semua request ke /api/downloader/* akan ditangani oleh downloaderRoutes
app.use('/api/downloader', downloaderRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
