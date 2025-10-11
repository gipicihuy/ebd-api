// server.js (UPDATED with FF Stalker)

import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import rucoyRoutes from './src/routes/rucoy.routes.js'; 
import tiktokRoutes from './src/routes/tiktok.routes.js';
import robloxRoutes from './src/routes/stalkrblx.routes.js'; 
import ffRoutes from './src/routes/ffstalk.routes.js'; // <-- NEW IMPORT

const app = express();
const PORT = process.env.PORT || 3000; 

// MIDDLEWARE
app.use(express.json());

// 1. ROUTE UTAMA
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tester.html'));
});

// 2. MOUNT ENDPOINT Rucoy API
app.use('/api/rucoy', rucoyRoutes);

// 3. MOUNT ENDPOINT Stalker API
app.use('/api/stalk', tiktokRoutes); 
app.use('/api/stalk', robloxRoutes); 
app.use('/api/stalk', ffRoutes); // <-- NEW MOUNT (BASE: /api/stalk/ff)

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
