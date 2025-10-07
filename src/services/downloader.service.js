// FILE: src/services/downloader.service.js (FIXED 403 ERROR)
import axios from 'axios';

// Gunakan sekumpulan header yang lebih lengkap untuk menghindari deteksi bot
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

const ENHANCED_HEADERS = {
    "User-Agent": USER_AGENT,
    // Header ini penting agar request terlihat seperti dari browser
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    // Penting: Mengklaim bahwa request berasal dari domain Spotisaver itu sendiri
    "Origin": "https://spotisaver.net" 
};


/**
 * Menggunakan logika scrape Spotisaver untuk mengambil metadata dan link track/playlist.
 */
export async function getSpotifyInfo(url) {
    let id, type, referer;
    
    // 1. Validasi URL Spotify dan ekstrak ID (Logika tetap dari teman Anda)
    if (url.includes("/track/")) {
        id = url.split("/track/")[1]?.split("?")[0];
        type = "track";
        referer = `https://spotisaver.net/en/track/${id}/`;
    } else if (url.includes("/playlist/")) {
        id = url.split("/playlist/")[1]?.split("?")[0];
        type = "playlist";
        referer = `https://spotisaver.net/en/playlist/${id}/`;
    } else {
        throw new Error("Invalid Spotify URL. Must contain /track/ or /playlist/.");
    }
    
    if (!id) {
        throw new Error("Could not extract ID from Spotify URL.");
    }

    const apiUrl = `https://spotisaver.net/api/get_playlist.php?id=${id}&type=${type}&lang=en`;

    try {
        // 2. Melakukan request ke API Spotisaver dengan ENHANCED HEADERS
        const res = await axios.get(apiUrl, { 
            headers: { 
                ...ENHANCED_HEADERS, 
                "Referer": referer // Referer tetap dinamis
            },
            timeout: 15000 
        });
        
        const tracks = res.data?.tracks || [];

        if (tracks.length === 0) {
            return { 
                error: "No tracks found or Spotisaver failed to process the URL."
            };
        }

        // 3. Membersihkan dan mengembalikan data
        const result = tracks.map(track => ({
            title: track.title,
            artists: track.artists,
            album: track.album,
            release_date: track.release_date,
            duration_ms: track.duration_ms,
            download_url: track.download_url || null, 
            metadata_source: "Spotisaver"
        }));

        return {
            source_url: url,
            type: type,
            count: result.length,
            tracks: result
        };

    } catch (error) {
        // Jika masih gagal, tampilkan error yang lebih deskriptif
        throw new Error(`Failed to scrape Spotisaver. Details: ${error.message}. Try checking the Referer or Spotisaver's latest protection.`);
    }
}

// Placeholder untuk fitur downloader lainnya
export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
