// FILE: src/services/rucoy.service.js (Logika Bisnis/Scraping)

import axios from 'axios';
import * as cheerio from 'cheerio'; 

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

/**
 * Fungsi untuk mencari informasi Karakter Rucoy.
 */
async function searchRucoyCharacter(charName) {
    const targetName = charName.replace(/\s/g, '%20'); 
    const url = `https://www.rucoyonline.com/characters/${targetName}`;
    
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': USER_AGENT },
            timeout: 15000 // Timeout 15 detik
        });
        const $ = cheerio.load(response.data);

        if ($('body').text().includes('Character not found')) {
            return null;
        }

        const charData = {};
        const tables = $('table');
        
        if (tables.length === 0) {
            return { error: 'Tidak ditemukan tabel data di halaman karakter Rucoy.' };
        }

        // Ambil data dari Tabel Status
        const charTable = tables.eq(0); 
        charTable.find('tbody tr').each((i, element) => {
            const label = $(element).find('td').eq(0).text().trim();
            const value = $(element).find('td').eq(1).text().trim();
            
            if (label && value) {
                const key = label.toLowerCase().replace(/\s/g, '_'); 
                if (['name', 'level', 'guild', 'title', 'last_online', 'born'].includes(key)) {
                    charData[key] = value.replace(/\s+/g, ' ').trim();
                }
            }
        });
        
        // Ambil data Recent Kills and Deaths
        const recentEvents = [];
        const killsDeathsTable = tables.eq(1); 
        
        if (killsDeathsTable.length > 0) {
            killsDeathsTable.find('tbody tr').each((i, element) => {
                let eventText = $(element).find('td').text();
                eventText = eventText.replace(/\s+/g, ' ').trim();
                
                if (eventText) {
                    recentEvents.push(eventText);
                }
            });
        }
        
        charData.recent_events = recentEvents;
        
        return charData.name ? charData : null;

    } catch (error) {
        return { error: `Kesalahan jaringan/timeout saat mencari karakter. (${error.code || 'UNKNOWN'})` };
    }
}


/**
 * Fungsi untuk mengambil data dari Leaderboard dengan kategori dan limit tertentu.
 */
async function scrapeRucoyLeaderboard(limit = 100, category = 'experience') {
    const validCategories = ['experience', 'melee', 'distance', 'magic', 'defense'];
    if (!validCategories.includes(category)) {
        return { error: `Kategori tidak valid: ${category}` };
    }
    
    const maxLimit = 500;
    const finalLimit = Math.min(Math.max(1, limit), maxLimit);
    
    const url = `https://www.rucoyonline.com/highscores/${category}`;
    
    try {
        const response = await axios.get(url, {
            headers: { 'User-Agent': USER_AGENT },
            timeout: 15000 
        });
        const $ = cheerio.load(response.data);
        const topPlayers = [];

        const tables = $('table');
        let leaderboardTable = tables.eq(0); 

        if (leaderboardTable.find('tbody tr').length === 0) { 
             return { error: 'Tabel Leaderboard tidak ditemukan atau strukturnya tidak valid.' };
        }

        leaderboardTable.find('tbody tr').slice(0, finalLimit).each((i, element) => {
            const row = $(element).find('td');
            if (row.length >= 3) {
                const rank = row.eq(0).text().trim();
                const name = row.eq(1).text().replace(/\s+/g, ' ').trim();
                const score = row.eq(2).text().trim(); 
                
                topPlayers.push({ rank, name, score });
            }
        });

        return topPlayers;

    } catch (error) {
        return { error: `Kesalahan jaringan/timeout saat mengambil Leaderboard. (${error.code || 'UNKNOWN'})` };
    }
}

export { searchRucoyCharacter, scrapeRucoyLeaderboard };
