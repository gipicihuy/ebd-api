// FILE: server.js (MODIFIKASI UNTUK STATIC FILES)
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

// 1. MIDDLEWARE UNTUK MELAYANI FILE STATIS (termasuk tester.html)
// Ini harus diletakkan di bagian paling atas
app.use(express.static(path.join(__dirname, '')));

// 2. MIDDLEWARE LAINNYA
app.use(express.json());

// ROUTING: Semua endpoint Rucoy
app.use('/api/rucoy', rucoyRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
