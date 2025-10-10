// FILE: server.js (UPDATED with TikTok Stalker)

import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import rucoyRoutes from './src/routes/rucoy.routes.js'; 
import tiktokRoutes from './src/routes/tiktok.routes.js'; // <-- BARU

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARE
app.use(express.json());

// 1. ROUTE UTAMA untuk melayani file HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tester.html'));
});

// 2. MOUNT ENDPOINT Rucoy API
app.use('/api/rucoy', rucoyRoutes);

// 3. MOUNT ENDPOINT TikTok Stalker API
app.use('/api/stalk', tiktokRoutes); // <-- BARU, base: /api/stalk/tiktok

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
