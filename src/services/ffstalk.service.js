// FILE: src/services/ffstalk.service.js

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const FF_API_BASE = 'https://api.duniagames.co.id/api';

async function _getToken() {
    try {
        const url = `${FF_API_BASE}/item-catalog/v1/get-token`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-Device": uuidv4(),
            "Content-Type": "application/json",
        };
        const payload = {"msisdn": "0812665588"};
        
        const response = await axios.post(url, payload, { headers, timeout: 10000 });
        const data = response.data;
        
        if (data.status && data.status.code === 0) {
            return data.data?.token;
        }
        return null;
    } catch (e) {
        return null;
    }
}

async function _getPlayerFullData(playerId, token) {
    try {
        const url = `${FF_API_BASE}/transaction/v1/top-up/inquiry/store`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-Device": uuidv4(),
            "Content-Type": "application/json",
        };
        const payload = {
            "productId": 3,
            "itemId": 353,
            "product_ref": "REG",
            "product_ref_denom": "REG",
            "catalogId": 376,
            "paymentId": 1252,
            "gameId": playerId,
            "token": token,
            "campaignUrl": "",
        };
        
        const response = await axios.post(url, payload, { headers, timeout: 10000 });
        const data = response.data;

        if (data.status && data.status.code === 0) {
            return data.data;
        }
        return null;
    } catch (e) {
        return null;
    }
}

function _parseCompleteData(playerId, fullData) {
    const gameDetail = fullData.gameDetail || {};
    
    // Perbaikan Waktu: Menggunakan Intl.DateTimeFormat untuk format ke WIB (Asia/Jakarta)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Jakarta' // Ini adalah kunci untuk mendapatkan waktu WIB
    });

    const parts = formatter.formatToParts(now);
    // Memformat ulang dari DD/MM/YYYY, HH:MM:SS menjadi YYYY-MM-DD HH:MM:SS
    const datePart = `${parts[4].value}-${parts[2].value}-${parts[0].value}`;
    const timePart = `${parts[6].value}:${parts[8].value}:${parts[10].value}`;
    const formattedDate = `${datePart} ${timePart}`;
    
    return {
        player_id: playerId,
        nickname: gameDetail.userName || "Unknown",
        server: gameDetail.serverName || "Unknown",
        game: "Free Fire",
        scan_time: formattedDate, // Sekarang sudah WIB
        status: "Active"
    };
}

export async function stalkFreeFirePlayer(playerId) {
    if (!playerId) return { error: "Player ID wajib diisi." };

    try {
        const token = await _getToken();
        if (!token) {
            return {"error": "Gagal mendapatkan token (API Gagal Merespon atau Blokir)."};
        }
        
        const fullData = await _getPlayerFullData(playerId, token);
        
        if (fullData) {
            return _parseCompleteData(playerId, fullData);
        } else {
            return {"error": "Player tidak ditemukan atau ID tidak valid."};
        }
        
    } catch (error) {
        let errorMsg = 'Kesalahan sistem saat memproses data.';
        if (error.response) {
            errorMsg = `Error API DG: Status ${error.response.status}`;
        }
        return {"error": errorMsg};
    }
}
