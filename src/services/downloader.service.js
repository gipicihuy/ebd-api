// FILE: src/services/downloader.service.js (PERBAIKAN NULL RESPONSE)

import axios from 'axios';

// Gunakan User Agent yang lebih umum untuk stabilitas
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

/**
 * Menggunakan logika scrape Pinterest Downloader (pinterestdownloader.io)
 */
export async function pinDown(url) {
    if (!url) throw new Error('URL Pinterest wajib diisi.');

    // 1. Ekstrak URL lengkap jika itu adalah short link pin.it/
    // Meskipun API target seharusnya menangani pengalihan, ini adalah praktik yang baik.
    let finalUrl = url;
    if (url.includes('pin.it/')) {
        try {
            // Melakukan request HEAD untuk mendapatkan lokasi pengalihan (redirect)
            const redirectRes = await axios.head(url, { maxRedirects: 0, timeout: 5000 });
            // Lokasi lengkap biasanya ada di header 'location'
            if (redirectRes.headers.location) {
                finalUrl = redirectRes.headers.location;
            }
        } catch (e) {
            // Jika head request gagal (misalnya 302/301 tidak ditangkap), lanjut dengan URL asli
            console.warn("Gagal mendapatkan redirect URL, menggunakan URL asli.");
        }
    }
    
    // 2. Lanjutkan scraping dengan URL lengkap
    const endpoint = 'https://pinterestdownloader.io/frontendService/DownloaderService';
    
    const headers = {
        'User-Agent': USER_AGENT,
        'Referer': 'https://pinterestdownloader.io/'
    };

    try {
        const res = await axios.get(endpoint, {
            params: { url: finalUrl }, // Menggunakan URL yang sudah dimurnikan
            headers: { ...headers, 'Accept': 'application/json' },
            timeout: 20000, 
            responseType: 'json'
        });

        const data = res.data;

        if (data.status === 'ERROR') {
             throw new Error(data.message || 'Gagal memproses link Pinterest. (API Target Error)');
        }
        
        // 3. Pengecekan Kualitas Data (PENTING)
        if (!data.link && !data.download_url && !data.metadata) {
             throw new Error('API Target merespon sukses, tetapi tidak ada tautan atau metadata yang ditemukan. Pin mungkin dilindungi atau tidak valid.');
        }

        // 4. Mengembalikan hasil
        return {
            source_url: url,
            processed_url: finalUrl,
            metadata: data.metadata || null,
            download_link: data.link || data.download_url || null,
            raw_response: data
        };

    } catch (err) {
        if (err.response) {
            // Tangani error HTTP
            throw new Error(`Gagal scrape Pinterest. Status: ${err.response.status}. Pesan: ${err.response.data.message || 'Error tidak diketahui'}`);
        }
        // Tangani error jaringan/timeout
        throw new Error(`Gagal scrape Pinterest. Detail: ${err.message}`);
    }
}

// Hapus/Ganti fungsi Spotify, Videy, dan Pixeldrain (dibiarkan kosong)
export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
