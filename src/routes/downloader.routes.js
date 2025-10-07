// FILE: src/routes/downloader.routes.js (BARU: PINTEREST & PLACEHOLDERS)

import express from 'express';
// Impor fungsi logika baru (pinDown)
import { 
    pinDown, 
    getVideyInfo, 
    getPixeldrainInfo 
} from '../services/downloader.service.js'; 

const router = express.Router();

// -------------------------------------------------------------------
// ROUTE: /pinterest (Akses melalui /api/downloader/pinterest?url=...)
// -------------------------------------------------------------------
router.get('/pinterest', async (req, res) => {
    const url = req.query.url; 

    if (!url) {
        return res.status(400).json({ 
            status: "error",
            error: "Parameter 'url' Pinterest wajib diisi."
        });
    }

    try {
        const data = await pinDown(url);
        
        // Hapus response mentah untuk menjaga kebersihan output
        const cleanData = { 
            status: "success", 
            source_url: data.source_url,
            metadata: data.metadata,
            download_link: data.download_link 
        };

        res.status(200).json(cleanData);
        
    } catch (e) {
        const status = e.message.includes("wajib diisi") ? 400 : 500;
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
