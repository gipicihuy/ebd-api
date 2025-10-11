// FILE: src/routes/tiktok.routes.js

import express from 'express';
import { bentarNgambilDulu } from '../services/tiktok.service.js'; 

const router = express.Router();

// ------------------------------------------------------------------
// ROUTE: /tiktok (Akses melalui /api/stalk/tiktok?username=...)
// ------------------------------------------------------------------
router.get('/tiktok', async (req, res) => {
    const username = req.query.username; 

    if (!username) {
        return res.status(400).json({ 
            error: "Parameter 'username' wajib diisi.",
            contoh: "/api/stalk/tiktok?username=puan_maharaniri"
        });
    }

    try {
        const data = await bentarNgambilDulu(username);
        
        if (data && data.error) {
            // Menangani error spesifik dari service (404, blokir, dll)
            const status = data.error.includes('404') ? 404 : 503;
            return res.status(status).json({ error: data.error }); 
        }

        if (!data || Object.keys(data).length === 0) {
            return res.status(503).json({ error: "Gagal mengambil data, mungkin diblokir oleh TikTok. Coba lagi." });
        }


        res.status(200).json({ 
            status: "success", 
            source: "tiktok.com",
            data: data
        });

    } catch (e) {
        console.error('TikTok Route Error:', e);
        res.status(500).json({ error: "Kesalahan server internal saat memproses permintaan TikTok." });
    }
});

export default router;
