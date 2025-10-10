// FILE: src/services/ffstalk.service.js

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Memerlukan: npm install uuid

const FF_API_BASE = 'https://api.duniagames.co.id/api';

/**
 * Helper: Mengambil token efemeral (sementara) dari API DG.
 */
async function _getToken() {
    try {
        const url = `${FF_API_BASE}/item-catalog/v1/get-token`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-Device": uuidv4(), // Menggunakan UUID unik
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

/**
 * Helper: Mengambil data lengkap pemain FF menggunakan Player ID dan token.
 */
async function _getPlayerFullData(playerId, token) {
    try {
        const url = `${FF_API_BASE}/transaction/v1/top-up/inquiry/store`;
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "X-Device": uuidv4(), // Menggunakan UUID unik
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

/**
 * Helper: Memformat data hasil akhir.
 */
function _parseCompleteData(playerId, fullData) {
    const gameDetail = fullData.gameDetail || {};
    const now = new Date();
    
    // Format YYYY-MM-DD HH:MM:SS
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    
    return {
        player_id: playerId,
        nickname: gameDetail.userName || "Unknown",
        server: gameDetail.serverName || "Unknown",
        game: "Free Fire",
        scan_time: formattedDate,
        status: "Active"
    };
}

/**
 * Fungsi utama untuk mencari data profil Free Fire berdasarkan Player ID.
 */
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
