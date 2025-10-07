// FILE: src/services/downloader.service.js (KODE SPOTISAVER ASLI, DIKEMAS DENGAN PROTEKSI ERROR)

import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

// Header yang benar-benar esensial dan paling 'browser-like'
const MINIMAL_BROWSER_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "cross-site",
    "Connection": "keep-alive",
    "Origin": "https://spotisaver.net" 
};


/**
 * Fungsi SPOTIFY ASLI (TARGET: spotisaver.net).
 * Kini menyertakan penanganan ERROR 403 / BLOKIR IP yang sangat jelas.
 */
export async function getSpotifyInfo(url) {
    let id, type, referer;
    
    // Logika ekstrak ID dari kode teman Anda
    if (url.includes("/track/")) {
        id = url.split("/track/")[1]?.split("?")[0];
        type = "track";
        referer = `https://spotisaver.net/en/track/${id}/`;
    } else if (url.includes("/playlist/")) {
        id = url.split("/playlist/")[1]?.split("?")[0];
        type = "playlist";
        referer = `https://spotisaver.net/en/playlist/${id}/`;
    } else {
        throw new Error("URL Spotify tidak valid. Harap gunakan URL Track atau Playlist.");
    }
    
    if (!id) {
        throw new Error("Tidak dapat mengekstrak ID dari URL Spotify.");
    }

    const apiUrl = `https://spotisaver.net/api/get_playlist.php?id=${id}&type=${type}&lang=en`;

    try {
        // Melakukan request GET ke Spotisaver dengan headers
        const res = await axios.get(apiUrl, { 
            headers: { 
                ...MINIMAL_BROWSER_HEADERS, 
                "Referer": referer, 
                "X-Forwarded-For": "66.249.66.1" // Trik IP
            },
            timeout: 20000 
        });
        
        const tracks = res.data?.tracks || [];

        if (tracks.length === 0) {
            return { error: "Tidak ditemukan track, atau Spotisaver gagal memproses URL." };
        }

        // Jika Sukses (Meskipun kemungkinan besar tidak akan terjadi di server Anda)
        const result = tracks.map(track => ({
            name: track.title, 
            artists: track.artists, 
            album: track.album,
            image: { url: track.image?.url || null, width: 640, height: 640 }, // Menambah format image
            id: track.id,
            external_url: track.external_url,
            duration_ms: track.duration_ms,
            release_date: track.release_date,
            download_url: track.download_url || null, 
            metadata_source: "Spotisaver (Original)"
        }));

        return {
            source_url: url,
            type: type,
            count: result.length,
            tracks: result
        };

    } catch (error) {
        // Ini adalah blok penanganan Error 403/500
        const status = error.response?.status;
        
        if (status === 403) {
            // Jika terdeteksi 403, berikan pesan yang sangat jelas
            throw new Error(`Spotisaver diblokir (403 Forbidden). Server Anda diblokir oleh Spotisaver. Endpoint ini sementara tidak dapat digunakan. Kode teman Anda benar, tetapi targetnya memblokir IP server.`);
        }
        
        // Error lainnya
        throw new Error(`Gagal menghubungi Spotisaver. Detail: ${error.message}`);
    }
}

// Placeholder untuk fitur downloader lainnya
export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
