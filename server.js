// FILE: server.js (UPDATED - Rucoy + General API)

import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';

// Helper untuk mendapatkan __dirname di mode ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import rucoyRoutes from './src/routes/rucoy.routes.js'; 
import generalRoutes from './src/routes/general.routes.js'; // IMPORT ROUTE BARU

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARE
app.use(express.json());

// 1. ROUTE UNTUK MELAYANI TESTER.HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tester.html'));
});

// 2. ENDPOINT Rucoy API (PATH LAMA)
app.use('/api/rucoy', rucoyRoutes);

// 3. ENDPOINT GENERAL API (PATH BARU)
app.use('/api', generalRoutes); // Rute akan menjadi /api/ai/gemini, /api/downloader/...

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
