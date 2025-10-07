// FILE: src/services/downloader.service.js (SPOTIFY ASLI - FINAL ATTEMPT V1.0.5)

import axios from 'axios';

// Gunakan User Agent yang sangat umum
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

// Header yang paling "stealth" untuk GET dan POST
const SPOTISAVER_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Origin": "https://spotisaver.net",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    // Simulasikan IP lain
    "X-Forwarded-For": "66.249.66.1" 
};


/**
 * 1. FUNGSI GET SPOTIFY INFO (Target: spotisaver.net)
 * Mengambil metadata/daftar lagu.
 */
export async function getSpotifyInfo(url) {
    let id, type, referer;
    
    if (url.includes("/track/")) {
        id = url.split("/track/")[1]?.split("?")[0];
        type = "track";
        referer = `https://spotisaver.net/en/track/${id}/`;
    } else if (url.includes("/playlist/")) {
        id = url.split("/playlist/")[1]?.split("?")[0];
        type = "playlist";
        referer = `https://spotisaver.net/en/playlist/${id}/`;
    } else {
        throw new Error("URL Spotify tidak valid");
    }

    const apiUrl = `https://spotisaver.net/api/get_playlist.php?id=${id}&type=${type}&lang=en`;

    try {
        const res = await axios.get(apiUrl, { 
            headers: { 
                ...SPOTISAVER_HEADERS, 
                "Referer": referer // Dynamic Referer
            },
            timeout: 20000 
        });
        
        // Kembalikan data dalam format yang diharapkan teman Anda
        return res.data?.tracks || [];

    } catch (error) {
        const status = error.response?.status;
        
        if (status === 403) {
            throw new Error(`Spotisaver diblokir (403 Forbidden). IP server Anda diblokir oleh Spotisaver di request GET.`);
        }
        
        throw new Error(`Gagal menghubungi Spotisaver. Detail: ${error.message}`);
    }
}

/**
 * 2. FUNGSI DOWNLOAD TRACK (Target: spotisaver.net)
 * user_ip dihapus sesuai saran teman Anda.
 */
export async function downloadTrack(track) {
    const payload = {
        track,
        download_dir: "downloads",
        filename_tag: "SPOTISAVER",
        // user_ip dihapus di sini
        is_premium: false
    }

    try {
        const res = await axios.post("https://spotisaver.net/api/download_track.php", payload, {
            headers: { 
                ...SPOTISAVER_HEADERS, 
                Referer: `https://spotisaver.net/en/track/${track.id}/` 
            },
            responseType: "arraybuffer",
            timeout: 30000 
        })

        return Buffer.from(res.data)
    } catch (error) {
         throw new Error(`Gagal mendownload track. Detail: ${error.message}.`);
    }
}

// -------------------------------------------------------------------
// FUNGSI PLACEHOLDER
// -------------------------------------------------------------------

export async function pinDown(url) {
    throw new Error('Endpoint Pinterest Downloader sementara dinonaktifkan.');
}

export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
