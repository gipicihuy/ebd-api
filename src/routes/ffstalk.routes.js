// FILE: src/routes/ffstalk.routes.js (Sudah Diperbaiki)

import express from 'express';
import { stalkFreeFirePlayer } from '../services/ffstalk.service.js'; 

const router = express.Router();

// ------------------------------------------------------------------
// ROUTE: /ff (Akses melalui /api/stalk/ff?id=...)
// ------------------------------------------------------------------
router.get('/ff', async (req, res) => {
    const playerId = req.query.id; 

    if (!playerId || !/^\d+$/.test(playerId)) {
        return res.status(400).json({ 
            error: "Parameter 'id' wajib diisi dan harus berupa angka.",
            contoh: "/api/stalk/ff?id=1234567890"
        });
    }

    try {
        const data = await stalkFreeFirePlayer(playerId);
        
        if (data && data.error) {
            // Error dari service layer (misalnya gagal token atau player not found)
            const status = data.error.includes('token') || data.error.includes('sistem') ? 503 : 404;
            return res.status(status).json({ error: data.error }); 
        }

        // PERUBAHAN KRITIS ADA DI BAWAH INI
        res.status(200).json({ 
            status: "success", 
            // BARIS INI MENGGANTIKAN 'source: "duniagames.co.id"'
            creator: "givy", 
            data: data
        });

    } catch (e) {
        // Error tak terduga
        res.status(500).json({ error: "Kesalahan server internal saat memproses permintaan Free Fire Stalk." });
    }
});

export default router;
