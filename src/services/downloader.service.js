// FILE: src/services/downloader.service.js (BARU: PINTEREST DENGAN FAILOVER)

import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';

// Fungsi utama dengan Failover
export async function pinDown(url) {
    if (!url) throw new Error('URL Pinterest wajib diisi.');

    // 1. Ekstrak URL lengkap jika itu adalah short link pin.it/
    let finalUrl = url;
    if (url.includes('pin.it/')) {
        try {
            const redirectRes = await axios.head(url, { maxRedirects: 0, timeout: 5000 });
            if (redirectRes.headers.location) {
                finalUrl = redirectRes.headers.location;
            }
        } catch (e) {
            // Lanjut dengan URL asli jika redirect gagal
        }
    }
    
    // --- COBA SUMBER PERTAMA: PINTERESTDOWNLOADER.IO ---
    try {
        const result1 = await scrapePinterestDownloaderIo(finalUrl);
        if (result1.download_link) {
            return result1; // SUKSES DARI SUMBER 1
        }
    } catch (e) {
        // Abaikan error dari sumber pertama, dan lanjut ke sumber kedua
        console.warn(`[Failover] Sumber 1 gagal: ${e.message}. Mencoba sumber 2...`);
    }

    // --- COBA SUMBER KEDUA: SAVEPIN.APP ---
    try {
        const result2 = await scrapeSavePinApp(finalUrl);
        if (result2.download_link) {
            return result2; // SUKSES DARI SUMBER 2
        }
    } catch (e) {
        // Abaikan error dari sumber kedua
        console.warn(`[Failover] Sumber 2 gagal: ${e.message}.`);
    }

    // Jika kedua sumber gagal mendapatkan link
    throw new Error('Gagal scrape Pinterest. Tidak ada tautan download yang ditemukan dari kedua sumber. Pin mungkin dilindungi atau tidak valid.');
}


// LOGIKA SCRAPING UNTUK SUMBER 1
async function scrapePinterestDownloaderIo(finalUrl) {
    const endpoint = 'https://pinterestdownloader.io/frontendService/DownloaderService';
    const headers = { 'User-Agent': USER_AGENT, 'Referer': 'https://pinterestdownloader.io/' };

    const res = await axios.get(endpoint, {
        params: { url: finalUrl }, 
        headers: { ...headers, 'Accept': 'application/json' },
        timeout: 20000, 
        responseType: 'json'
    });

    const data = res.data;

    if (data.status === 'ERROR' || (!data.link && !data.download_url)) {
        throw new Error(`pinterestdownloader.io: ${data.message || 'Tautan tidak ditemukan.'}`);
    }
    
    return {
        source_url: finalUrl,
        metadata: data.metadata || null,
        download_link: data.link || data.download_url || null,
        scraper_source: "pinterestdownloader.io"
    };
}


// LOGIKA SCRAPING UNTUK SUMBER 2 (BARU)
async function scrapeSavePinApp(finalUrl) {
    const endpoint = 'https://savepin.app/api/ajax.php';
    const headers = { 
        'User-Agent': USER_AGENT, 
        'Referer': 'https://savepin.app/',
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    
    // Data dikirim dalam format form-urlencoded
    const payload = new URLSearchParams({
        url: finalUrl,
        ajax: '1'
    }).toString();

    const res = await axios.post(endpoint, payload, {
        headers: headers,
        timeout: 20000,
        responseType: 'json'
    });
    
    const data = res.data;

    // SavePin mereturn HTML jika gagal, atau JSON jika sukses. Kita perlu cek.
    if (typeof data !== 'object' || data.error) {
        throw new Error(`savepin.app: Tautan tidak ditemukan atau Pin tidak valid.`);
    }

    // SavePin sering mereturn download link di properti berbeda
    const downloadLink = data.url || data.urls?.[0]?.url || data.data?.[0]?.url || null;

    if (!downloadLink) {
        throw new Error(`savepin.app: Tautan download ditemukan tetapi null.`);
    }
    
    return {
        source_url: finalUrl,
        metadata: data.title || null,
        download_link: downloadLink,
        scraper_source: "savepin.app"
    };
}

// Fungsi placeholder lainnya (dibiarkan kosong)
export async function getVideyInfo(url) {
    return { error: "Downloader Videy belum diimplementasikan." };
}

export async function getPixeldrainInfo(url) {
    return { error: "Downloader Pixeldrain belum diimplementasikan." };
}
