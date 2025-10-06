// FILE: server.js
import express from 'express';
import rucoyRoutes from './src/routes/rucoy.routes.js'; // Import Rucoy Routes

const app = express();
const PORT = process.env.PORT || 3000; // Menggunakan port dinamis untuk deploy

// Middleware
app.use(express.json());

// Endpoint Root
app.get('/', (req, res) => {
    res.status(200).json({
        status: "Rucoy API is Running",
        version: "1.0",
        endpoints: {
            info: "Akses /api/rucoy/stalk?name=..., /api/rucoy/leaderboard?..."
        }
    });
});

// ROUTING: Semua endpoint Rucoy dimulai dengan /api/rucoy
app.use('/api/rucoy', rucoyRoutes);

// Jalankan server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
