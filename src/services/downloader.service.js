// FILE: src/services/downloader.service.js (BARU: PINTEREST DOWNLOADER)

import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

/**
 * Menggunakan logika scrape Pinterest Downloader (pinterestdownloader.io)
 */
export async function pinDown(url) {
    if (!url) throw new Error('URL Pinterest wajib diisi.');

    const endpoint = 'https://pinterestdownloader.io/frontendService/DownloaderService';
    
    // Gunakan headers yang serupa dengan kode teman Anda
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://pinterestdownloader.io/'
    };

    try {
        const res = await axios.get(endpoint, {
            params: { url },
            headers: { ...headers, 'Accept': 'application/json' },
            timeout: 20000, 
            responseType: 'json'
        });

        const data = res.data;

        if (data.status === 'ERROR') {
             throw new Error(data.message || 'Gagal memproses link Pinterest.');
        }
        
        // Asumsi data yang dikembalikan memiliki format yang berguna
        return {
            source_url: url,
            metadata: data.metadata || null,
            download_link: data.link || data.download_url || null,
            raw_response: data
        };

    } catch (err) {
        if (err.response) {
            // Tangani error HTTP seperti 404 atau 500 dari API Target
            throw new Error(`Gagal scrape Pinterest. Status: ${err.response.status}. Pesan: ${err.response.data.message || 'Error tidak diketahui'}`);
        }
        // Tangani error jaringan/timeout
        throw new Error(`Gagal scrape Pinterest. Detail: ${err.message}`);
    }
}

// Hapus/Ganti fungsi Spotify, Videy, dan Pixeldrain
export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
