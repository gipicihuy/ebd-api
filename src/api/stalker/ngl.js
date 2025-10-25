/* File: src/api/stalker/ngl.js */
const axios = require('axios');

/**
 * Fungsi untuk membuat random user agent browser
 */
function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0'
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Fungsi untuk membuat random IP
 */
function generateRandomIP() {
    return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
}

/**
 * Fungsi untuk mengecek apakah NGL username valid/sudah digunakan
 * @param {string} username - Username NGL yang akan diperiksa
 */
async function checkNGLUsername(username) {
    if (!username) return { error: "Username NGL wajib diisi." };

    try {
        const url = `https://ngl.link/${username}`;
        const randomIP = generateRandomIP();
        
        const headers = {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'X-Forwarded-For': randomIP,
            'X-Real-IP': randomIP,
            'X-Client-IP': randomIP,
            'Referer': 'https://ngl.link/',
            'Cache-Control': 'max-age=0',
        };

        const response = await axios.get(url, {
            headers: headers,
            timeout: 10000,
            maxRedirects: 0,
            validateStatus: (status) => {
                return status >= 200 && status < 500;
            }
        });

        const statusCode = response.status;
        const content = response.data ? response.data.toLowerCase() : '';
        
        // Indikator profil NGL yang valid
        const nglIndicators = [
            'send anonymous messages',
            'ask me anything',
            'ngl.link',
            'anonymous questions',
            'type your question',
            'submit',
            'message received'
        ];
        
        // Indikator halaman error/not found
        const errorIndicators = [
            'page not found',
            'does not exist',
            'not found',
            '404',
            'error'
        ];
        
        const foundIndicators = nglIndicators.filter(i => content.includes(i));
        const foundErrors = errorIndicators.filter(i => content.includes(i));
        
        // Analisis hasil
        let result = {
            username: username,
            status: 'unknown',
            valid: false,
            profileUrl: `https://ngl.link/${username}`,
            description: ''
        };
        
        if (statusCode === 404) {
            result.status = 'not_found';
            result.description = 'Username tidak ditemukan atau tidak aktif';
        } else if (statusCode === 200) {
            if (foundIndicators.length >= 2) {
                result.status = 'valid';
                result.valid = true;
                result.description = 'Profil NGL valid dan aktif';
            } else if (foundErrors.length >= 1) {
                result.status = 'invalid';
                result.description = 'Username tidak valid atau akun tidak aktif';
            } else {
                result.status = 'uncertain';
                result.description = 'Status tidak bisa dipastikan, profil mungkin privat atau berbeda';
            }
        } else {
            result.status = `http_${statusCode}`;
            result.description = `HTTP Status ${statusCode}`;
        }
        
        return result;
        
    } catch (error) {
        let errorMsg = 'Kesalahan saat mengecek username NGL';
        
        if (error.response && error.response.status >= 300 && error.response.status < 400) {
            const redirectLocation = error.response.headers.location || '';
            if (redirectLocation && !redirectLocation.includes('ngl.link')) {
                return {
                    error: 'Username tidak valid (terjadi redirect ke halaman lain)',
                    username: username
                };
            }
        }
        
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            errorMsg = 'Request timeout ke NGL.link';
        } else if (error.code === 'ENOTFOUND') {
            errorMsg = 'Koneksi ke NGL.link gagal';
        }
        
        return {
            error: errorMsg,
            username: username
        };
    }
}

/**
 * Fungsi untuk mengambil informasi profil NGL secara detail (jika tersedia)
 */
async function getNGLProfileInfo(username) {
    if (!username) return { error: "Username NGL wajib diisi." };

    try {
        const url = `https://ngl.link/${username}`;
        const randomIP = generateRandomIP();
        
        const headers = {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'X-Forwarded-For': randomIP,
            'X-Real-IP': randomIP,
            'Referer': 'https://ngl.link/',
        };

        const response = await axios.get(url, {
            headers: headers,
            timeout: 10000,
            maxRedirects: 2,
        });

        const content = response.data;
        
        // Extract basic info dari HTML
        let displayName = username;
        let description = '';
        let messageCount = 0;
        
        // Cek jika ada meta tags atau data di halaman
        const displayNameMatch = content.match(/display[_-]?name['":\s]*[=:]\s*['"](.*?)['"]/i);
        if (displayNameMatch) {
            displayName = displayNameMatch[1];
        }
        
        const descriptionMatch = content.match(/description['":\s]*[=:]\s*['"](.*?)['"]/i);
        if (descriptionMatch) {
            description = descriptionMatch[1];
        }
        
        return {
            username: username,
            displayName: displayName,
            description: description,
            profileUrl: `https://ngl.link/${username}`,
            valid: true
        };
        
    } catch (error) {
        return {
            error: error.message || 'Gagal mengambil informasi profil',
            username: username
        };
    }
}

// ===================================
// === MODUL EXPRESS ENDPOINT ===
// ===================================
module.exports = function (app) {
    
    /**
     * Endpoint: GET /stalk/ngl
     * Mengecek status username NGL (valid/tidak)
     * Query: username (required)
     */
    app.get('/stalk/ngl', async (req, res) => {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({
                status: false,
                message: "Parameter 'username' wajib diisi. Contoh: /stalk/ngl?username=namauser"
            });
        }
        
        try {
            const result = await checkNGLUsername(username);
            
            if (result.error) {
                return res.status(500).json({
                    status: false,
                    creator: 'Eberardos',
                    message: result.error,
                    username: username
                });
            }
            
            res.json({
                status: true,
                creator: 'Eberardos',
                result: result
            });
            
        } catch (error) {
            console.error("Error in /stalk/ngl:", error);
            res.status(500).json({
                status: false,
                message: error.message || 'Terjadi kesalahan internal pada server.',
                username: username
            });
        }
    });
    
    /**
     * Endpoint: GET /stalk/ngl/info
     * Mengambil informasi profil NGL secara detail
     * Query: username (required)
     */
    app.get('/stalk/ngl/info', async (req, res) => {
        const { username } = req.query;
        
        if (!username) {
            return res.status(400).json({
                status: false,
                message: "Parameter 'username' wajib diisi. Contoh: /stalk/ngl/info?username=namauser"
            });
        }
        
        try {
            const result = await getNGLProfileInfo(username);
            
            if (result.error) {
                return res.status(500).json({
                    status: false,
                    creator: 'Eberardos',
                    message: result.error,
                    username: username
                });
            }
            
            res.json({
                status: true,
                creator: 'Eberardos',
                result: result
            });
            
        } catch (error) {
            console.error("Error in /stalk/ngl/info:", error);
            res.status(500).json({
                status: false,
                message: error.message || 'Terjadi kesalahan internal pada server.',
                username: username
            });
        }
    });
};
