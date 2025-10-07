// FILE: server.js (V1.0.5 Beta - Hanya Rucoy & AI)

import express from 'express';
// Tambahkan path untuk mengelola lokasi file
import path from 'path'; 
import { fileURLToPath } from 'url';

// Helper untuk mendapatkan __dirname di mode ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import rucoyRoutes from './src/routes/rucoy.routes.js'; 
// import downloaderRoutes from './src/routes/downloader.routes.js'; <--- DIHAPUS

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARE
app.use(express.json());

// 1. ROUTE UTAMA untuk melayani file HTML
app.get('/', (req, res) => {
    // Kirim file tester.html dari root folder saat user mengakses URL dasar /
    res.sendFile(path.join(__dirname, 'tester.html'));
});

// 2. MOUNT ENDPOINT Rucoy API
app.use('/api/rucoy', rucoyRoutes);

// 3. MOUNT ENDPOINT Downloader API <--- DIHAPUS
// app.use('/api/downloader', downloaderRoutes); 

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
