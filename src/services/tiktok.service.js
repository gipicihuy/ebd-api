// FILE: src/services/tiktok.service.js

import axios from 'axios';

// Daftar User-Agent untuk variasi (anti-blokir)
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15'
];

/**
 * Fungsi untuk mengambil data profil TikTok dari username (menggunakan logika scraping Anda).
 * @param {string} username - Username TikTok tanpa '@'.
 */
export async function bentarNgambilDulu(username) {
    const input_le = username;
    // Menggunakan random IP dan random User-Agent untuk anti-scraping
    const cukuruk = `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`;
    const prikitiww = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    try {
        const url = `https://www.tiktok.com/@${input_le}`;
        
        const headers = {
            'User-Agent': prikitiww,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
            'X-Forwarded-For': cukuruk,
            'X-Real-IP': cukuruk,
        };

        const response = await axios.get(url, { 
            headers, 
            timeout: 15000 // 15s timeout for safety
        });
        
        const html_content = response.data;
        
        if (!html_content) {
            return { error: 'Gagal mengambil konten HTML. Struktur web TikTok mungkin berubah.' };
        }

        const universal_data_pattern = /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/s;
        const universal_match = html_content.match(universal_data_pattern);

        if (!universal_match) {
            return { error: 'Data universal TikTok tidak ditemukan. Struktur HTML mungkin sudah dienkripsi/berubah.' };
        }

        // --- Parsing Logic ---
        const universal_data = JSON.parse(universal_match[1]);
        let user_info = universal_data.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo || {};
        
        // Fallback check
        if (Object.keys(user_info).length === 0) {
            const default_scope = universal_data['__DEFAULT_SCOPE__'] || universal_data;
            for (const key in default_scope) {
                if (key.includes('user') || key.includes('detail')) {
                    user_info = default_scope[key]?.userInfo || {};
                    if (Object.keys(user_info).length > 0) break;
                }
            }
        }

        const user_data = user_info.user || {};
        const stats_data = user_info.stats || {};
        const stats_v2_data = user_info.statsV2 || {};

        if (Object.keys(user_data).length === 0) {
            return { error: 'Data pengguna tidak ditemukan di Universal Data (kemungkinan akun privat atau tidak ada).' };
        }
        
        // --- Response Formatting (as per your logic) ---
        let signature = user_data.signature?.trim() || "No bio yet";

        const format_timestamp = (timestamp) => {
            if (!timestamp) return "Unknown";
            try {
                const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
                const dt = new Date(timestamp * 1000);
                const day_name = days[dt.getDay()];
                const formatted_date = `${dt.getDate().toString().padStart(2, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getFullYear()} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`;
                return `${timestamp} (${day_name}, ${formatted_date})`;
            } catch {
                return String(timestamp);
            }
        };

        const ini_respon = {
            id: user_data.id,
            shortId: user_data.shortId,
            uniqueId: user_data.uniqueId,
            nickname: user_data.nickname,
            nickNameModifyTime: format_timestamp(user_data.nickNameModifyTime),
            signature: signature,
            createTime: format_timestamp(user_data.createTime),
            verified: user_data.verified,
            privateAccount: user_data.privateAccount,
            region: user_data.region,
            language: user_data.language,
            secUid: user_data.secUid,
            avatarLarger: user_data.avatarLarger,
            avatarMedium: user_data.avatarMedium,
            avatarThumb: user_data.avatarThumb,
            stats: {
                followerCount: stats_data.followerCount,
                followingCount: stats_data.followingCount,
                heart: stats_data.heart,
                heartCount: stats_data.heartCount,
                videoCount: stats_data.videoCount,
                diggCount: stats_data.diggCount,
                friendCount: stats_data.friendCount
            },
            statsV2: {
                followerCount: stats_v2_data.followerCount,
                followingCount: stats_v2_data.followingCount,
                heart: stats_v2_data.heart,
                heartCount: stats_v2_data.heartCount,
                videoCount: stats_v2_data.videoCount,
                diggCount: stats_v2_data.diggCount,
                friendCount: stats_v2_data.friendCount
            }
        };

        return ini_respon;
        
    } catch (error) {
        let msg = 'Error jaringan atau timeout saat request ke TikTok.';
        if (error.response) {
            if (error.response.status === 404) {
                 msg = 'Akun TikTok tidak ditemukan (404 Not Found).';
            } else if (error.response.status === 444) {
                 msg = 'Akun TikTok ini sepertinya sudah di-banned (444 No Response).';
            } else {
                 msg = `Error request TikTok: Status ${error.response.status}.`;
            }
        }
        return { error: msg };
    }
}
