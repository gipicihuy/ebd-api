// FILE: src/routes/downloader.routes.js (Routing Spotify V1.0.5)

import express from 'express';
// Impor fungsi logika dari service
import { getSpotifyInfo, pinDown, getVideyInfo, getPixeldrainInfo } from '../services/downloader.service.js'; 

const router = express.Router();

// -------------------------------------------------------------------
// ROUTE: /spotify (Akses melalui /api/downloader/spotify?url=...)
// -------------------------------------------------------------------
router.get('/spotify', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).json({ status: "error", error: "Parameter 'url' Spotify wajib diisi." });
    }

    try {
        // Panggil fungsi yang sudah diperbaiki
        const tracks = await getSpotifyInfo(url);
        
        res.status(200).json({ status: "success", tracks: tracks });
    } catch (e) {
        // Tangani 403 (Forbidden) secara eksplisit
        const status = e.message.includes("403") ? 403 : 500;
        res.status(status).json({ status: "error", error: e.message });
    }
});


// -------------------------------------------------------------------
// ROUTE: /pinterest (Saat ini nonaktif karena konflik/fokus)
// -------------------------------------------------------------------
router.get('/pinterest', async (req, res) => {
    try {
        await pinDown(); // Fungsi ini akan langsung melempar error nonaktif
    } catch (e) {
        res.status(503).json({ status: "error", error: e.message });
    }
});

// ROUTE: /videy & /pixeldrain (Placeholder)
router.get('/videy', async (req, res) => {
    const data = await getVideyInfo();
    res.status(501).json({ status: "error", error: data.error }); 
});

router.get('/pixeldrain', async (req, res) => {
    const data = await getPixeldrainInfo();
    res.status(501).json({ status: "error", error: data.error }); 
});


export default router;
