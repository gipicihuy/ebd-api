// FILE: src/services/downloader.service.js (ATTEMPT 3: Advanced Anti-403)
import axios from 'axios';

// Gunakan User Agent yang sangat umum
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

// Header yang benar-benar esensial dan paling 'browser-like'
const MINIMAL_BROWSER_HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin", // Mengklaim request berasal dari Spotisaver
    "Connection": "keep-alive",
    "Origin": "https://spotisaver.net" // Klaim Asal
};


/**
 * Menggunakan logika scrape Spotisaver untuk mengambil metadata dan link track/playlist.
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
        throw new Error("Invalid Spotify URL. Must contain /track/ or /playlist/.");
    }
    
    if (!id) {
        throw new Error("Could not extract ID from Spotify URL.");
    }

    const apiUrl = `https://spotisaver.net/api/get_playlist.php?id=${id}&type=${type}&lang=en`;

    try {
        // 2. Melakukan request ke API Spotisaver dengan Header yang sangat terperinci
        const res = await axios.get(apiUrl, { 
            headers: { 
                ...MINIMAL_BROWSER_HEADERS, 
                "Referer": referer, // Referer tetap dinamis
                // Tambahkan header X-Forwarded-For untuk mensimulasikan IP lain
                "X-Forwarded-For": "66.249.66.1" 
            },
            timeout: 20000 // Tingkatkan timeout
        });
        
        const tracks = res.data?.tracks || [];

        if (tracks.length === 0) {
            return { 
                error: "No tracks found or Spotisaver failed to process the URL."
            };
        }

        // 3. Membersihkan dan mengembalikan data (Logika sukses)
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
        // Jika masih 403, kemungkinan besar Spotisaver memerlukan CAPTCHA/Cookie yang tidak bisa kita dapatkan.
        let status = error.response?.status || 'Unknown';
        let msg = `Request failed with status code ${status}. Spotisaver probably requires a CAPTCHA or a specific token/cookie which is difficult to bypass via simple scraping.`;
        
        if (status === 403) {
            msg = `Request failed with status code 403. Spotisaver has blocked this server IP or requires advanced security tokens. **Spotisaver is currently unreachable for scraping.**`;
        }

        throw new Error(`Failed to scrape Spotisaver. Details: ${msg}`);
    }
}

// Placeholder untuk fitur downloader lainnya
export async function getVideyInfo(url) {
    // ... Implementasi Videy di sini
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    // ... Implementasi Pixeldrain di sini
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
