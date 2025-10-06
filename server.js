// FILE: server.js (FINAL FIX UNTUK MELAYANI tester.html)

import express from 'express';
// Tambahkan path untuk mengelola lokasi file
import path from 'path'; 
import { fileURLToPath } from 'url';

// Helper untuk mendapatkan __dirname di mode ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import rucoyRoutes from './src/routes/rucoy.routes.js'; 

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARE
app.use(express.json());

// 1. TAMBAH ROUTE UNTUK MELAYANI TESTER.HTML
app.get('/', (req, res) => {
    // Kirim file tester.html dari root folder saat user mengakses URL dasar /
    res.sendFile(path.join(__dirname, 'tester.html'));
});

// 2. ENDPOINT Rucoy API
app.use('/api/rucoy', rucoyRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
