/* File: src/api/tools/spamngl.js */
/* Creator: JawirDev, Modified for API */
const axios = require('axios');
const crypto = require('crypto');

/**
 * Fungsi untuk generate random string
 * @param {number} length - Panjang string yang dihasilkan
 */
function randomString(length) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Fungsi untuk mengirim satu pesan ke NGL
 * @param {string} username - Username target NGL
 * @param {string} message - Pesan yang akan dikirim
 */
async function sendNGLMessage(username, message) {
    try {
        const deviceId = randomString(21);
        const url = 'https://ngl.link/api/submit';
        
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': `https://ngl.link/${username}`,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        };
        
        const body = `username=${encodeURIComponent(username)}&question=${encodeURIComponent(message)}&deviceId=${deviceId}&gameSlug=&referrer=`;
        
        const response = await axios.post(url, body, { 
            headers,
            timeout: 10000,
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            }
        });
        
        return response.status === 200;
    } catch (error) {
        console.error(`[NGL Spam Error] ${error.message}`);
        return false;
    }
}

/**
 * Fungsi utama untuk spam NGL
 * @param {string} username - Username target NGL
 * @param {string} message - Pesan yang akan dikirim
 * @param {number} count - Jumlah pesan yang akan dikirim
 */
async function nglSpam(username, message, count) {
    if (!username || !message || count <= 0) {
        return { error: 'Username, pesan, dan jumlah wajib diisi dengan benar.' };
    }

    if (count > 25) {
        return { error: 'Jumlah maksimal spam adalah 25 pesan!' };
    }

    try {
        let successCount = 0;
        const results = [];

        for (let i = 0; i < count; i++) {
            const success = await sendNGLMessage(username, message);
            if (success) {
                successCount++;
            }
            results.push({
                attempt: i + 1,
                status: success ? 'Berhasil' : 'Gagal'
            });
            
            // Delay 500ms antar request untuk menghindari rate limit
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return {
            target: username,
            message: message,
            totalAttempt: count,
            successCount: successCount,
            failCount: count - successCount,
            successRate: `${((successCount / count) * 100).toFixed(2)}%`,
            details: results
        };

    } catch (error) {
        console.error('NGL Spam Service Error:', error.message);
        return { error: 'Kesalahan saat memproses spam NGL.' };
    }
}

// ===================================
// === MODUL EXPRESS ENDPOINT ===
// ===================================
module.exports = function (app) {
    app.get('/tools/ngl', async (req, res) => {
        const { username, message, count } = req.query;
        
        if (!username || !message || !count) {
            return res.status(400).json({
                status: false,
                message: "Parameter 'username', 'message', dan 'count' wajib diisi. Contoh: /tools/ngl?username=jawirdev&message=Gacor&count=5"
            });
        }

        const numCount = parseInt(count);
        
        if (isNaN(numCount) || numCount <= 0) {
            return res.status(400).json({
                status: false,
                message: "Parameter 'count' harus berupa angka positif."
            });
        }

        if (numCount > 25) {
            return res.status(400).json({
                status: false,
                message: "Jumlah maksimal spam adalah 25 pesan!"
            });
        }

        try {
            const result = await nglSpam(username, message, numCount);
            
            if (result.error) {
                return res.status(500).json({
                    status: false,
                    creator: 'Eberardos',
                    message: result.error
                });
            }
            
            // Sukses - kembalikan hasil spam
            res.json({
                status: true,
                creator: 'Eberardos',
                result: result
            });
        } catch (error) {
            console.error("Unhandled error in /tools/ngl:", error);
            res.status(500).json({
                status: false,
                message: error.message || 'Terjadi kesalahan internal pada server.'
            });
        }
    });
};
