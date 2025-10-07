// FILE: src/routes/downloader.routes.js
import express from 'express';
// Impor fungsi logika dari service
import { 
    getSpotifyInfo, 
    getVideyInfo, 
    getPixeldrainInfo 
} from '../services/downloader.service.js'; 

const router = express.Router();

// -------------------------------------------------------------------
// ROUTE: /spotify (Akses melalui /api/downloader/spotify?url=...)
// -------------------------------------------------------------------
router.get('/spotify', async (req, res) => {
    const url = req.query.url; 

    if (!url) {
        return res.status(400).json({ 
            status: "error",
            error: "Parameter 'url' Spotify wajib diisi."
        });
    }

    try {
        const data = await getSpotifyInfo(url);
        
        if (data.error) return res.status(503).json({ status: "error", error: data.error });

        res.status(200).json({ status: "success", ...data });
        
    } catch (e) {
        const status = e.message.includes("Invalid Spotify URL") ? 400 : 500;
        res.status(status).json({ status: "error", error: e.message });
    }
});

// -------------------------------------------------------------------
// ROUTE: /videy & /pixeldrain (Placeholder)
// -------------------------------------------------------------------

router.get('/videy', async (req, res) => {
    const url = req.query.url; 
    if (!url) return res.status(400).json({ status: "error", error: "Parameter 'url' Videy wajib diisi."});
    const data = await getVideyInfo(url);
    res.status(501).json({ status: "error", error: data.error }); 
});

router.get('/pixeldrain', async (req, res) => {
    const url = req.query.url; 
    if (!url) return res.status(400).json({ status: "error", error: "Parameter 'url' Pixeldrain wajib diisi."});
    const data = await getPixeldrainInfo(url);
    res.status(501).json({ status: "error", error: data.error }); 
});

export default router;
