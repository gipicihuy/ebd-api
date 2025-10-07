// FILE: src/routes/rucoy.routes.js (Routing Express)

import express from 'express';
// Impor fungsi logika dari service
import { searchRucoyCharacter, scrapeRucoyLeaderboard } from '../services/rucoy.service.js'; 

const router = express.Router();

// -------------------------------------------------------------------
// ROUTE: /stalk (Akses melalui /api/rucoy/stalk?name=...)
// -------------------------------------------------------------------
router.get('/stalk', async (req, res) => {
    const charName = req.query.name; 

    if (!charName) {
        return res.status(400).json({ 
            error: "Parameter 'name' wajib diisi.",
            contoh: "/api/rucoy/stalk?name=xzydanzz"
        });
    }

    try {
        const data = await searchRucoyCharacter(charName);
        if (data && data.error) return res.status(503).json({ error: data.error });
        if (!data) return res.status(404).json({ error: "Karakter tidak ditemukan." });

        res.status(200).json({ status: "success", data: data });
    } catch (e) {
        // Ini menangani error tak terduga
        res.status(500).json({ error: "Kesalahan server internal." });
    }
});


// -------------------------------------------------------------------
// ROUTE: /leaderboard (Akses melalui /api/rucoy/leaderboard?...)
// -------------------------------------------------------------------
router.get('/leaderboard', async (req, res) => {
    const category = req.query.category ? req.query.category.toLowerCase() : 'experience';
    const limit = parseInt(req.query.limit) || 100;

    const validCategories = ['experience', 'melee', 'distance', 'magic', 'defense'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ 
            error: `Kategori tidak valid: ${category}.`,
            valid_categories: validCategories 
        });
    }
    
    const finalLimit = Math.min(Math.max(1, limit), 500);

    try {
        const data = await scrapeRucoyLeaderboard(finalLimit, category);

        if (data && data.error) return res.status(503).json({ error: data.error });

        res.status(200).json({ 
            status: "success", 
            category: category,
            count: data.length,
            data: data 
        });
    } catch (e) {
        res.status(500).json({ error: "Kesalahan server internal." });
    }
});

export default router;
