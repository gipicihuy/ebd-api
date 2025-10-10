// FILE: src/routes/stalkrblx.routes.js

import express from 'express';
// Mengimpor fungsi dari service dengan nama file yang sesuai
import { stalkRobloxUser } from '../services/stalkrblx.service.js'; 

const router = express.Router();

// ------------------------------------------------------------------
// ROUTE: /roblox (Akses melalui /api/stalk/roblox?username=...)
// ------------------------------------------------------------------
router.get('/roblox', async (req, res) => {
    const username = req.query.username; 

    if (!username) {
        return res.status(400).json({ 
            error: "Parameter 'username' wajib diisi.",
            contoh: "/api/stalk/roblox?username=builderman"
        });
    }

    try {
        const data = await stalkRobloxUser(username);
        
        if (data && data.error) {
            // Menangani error spesifik dari service (404, dll)
            const status = data.error.includes('404') ? 404 : 503;
            return res.status(status).json({ error: data.error }); 
        }

        res.status(200).json({ 
            status: "success", 
            source: "roblox.com",
            data: data
        });

    } catch (e) {
        console.error('Roblox Stalk Route Error:', e);
        res.status(500).json({ error: "Kesalahan server internal saat memproses permintaan Roblox." });
    }
});

export default router;
