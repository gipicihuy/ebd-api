// FILE: src/services/downloader.service.js
import axios from 'axios';

// User Agent yang sama dengan yang digunakan oleh teman Anda
const USER_AGENT = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36";

/**
 * Menggunakan logika scrape Spotisaver untuk mengambil metadata dan link track/playlist.
 */
export async function getSpotifyInfo(url) {
    let id, type, referer;
    
    // 1. Validasi URL Spotify dan ekstrak ID
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
        // 2. Melakukan request ke API Spotisaver
        const res = await axios.get(apiUrl, { 
            headers: { 
                "User-Agent": USER_AGENT, 
                "Referer": referer // Penting untuk melewati proteksi
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
            // Ini adalah link download yang diekstrak dari Spotisaver
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
        throw new Error(`Failed to scrape Spotisaver. Details: ${error.message}`);
    }
}

// Placeholder untuk fitur downloader lainnya
export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
