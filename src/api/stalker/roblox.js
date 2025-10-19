
import axios from 'axios';

const ROBLOX_API_BASE = 'https://users.roblox.com/v1';
// const API_BASE = 'https://api.roblox.com'; // Tidak perlu jika hanya menggunakan endpoints v1

/**
 * Fungsi pembantu untuk memformat tanggal ISO 8601 (Roblox)
 * menjadi format YYYY-MM-DD.
 * @param {string} isoDate - Tanggal ISO 8601 dari API Roblox.
 */
const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown";
    try {
        // Hanya ambil bagian tanggal (YYYY-MM-DD)
        return isoDate.substring(0, 10); 
    } catch {
        return "Invalid Date";
    }
};

/**
 * Fungsi utama untuk mencari data profil Roblox berdasarkan username.
 * Nama diubah menjadi 'stalkRobloxUser'
 * @param {string} username - Username Roblox.
 */
export async function stalkRobloxUser(username) {
    if (!username) return { error: "Username Roblox wajib diisi." };

    try {
        let userId = null;
        let userData = null;

        // --- 1. Mendapatkan User ID ---
        // Mencoba mendapatkan ID melalui endpoint usernames/users (POST)
        const id_payload = { "usernames": [username], "excludeBannedUsers": true };
        const id_response = await axios.post(`${ROBLOX_API_BASE}/usernames/users`, id_payload, { timeout: 10000 });
        
        if (id_response.data && id_response.data.data && id_response.data.data.length > 0) {
            userId = id_response.data.data[0].id;
        }

        if (!userId) {
            return { error: `User tidak ditemukan: ${username}. Pastikan username benar.` };
        }

        // --- 2. Ambil Detail User ---
        const userDetailUrl = `${ROBLOX_API_BASE}/users/${userId}`;
        const detailResponse = await axios.get(userDetailUrl);
        userData = detailResponse.data;

        // --- 3. Ambil Data Tambahan secara Paralel ---
        const [
            avatarRes,
            badgesRes,
            friendsCountRes,
            groupsRes,
            presenceRes
        ] = await Promise.all([
            // Avatar Headshot
            axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`),
            // Badges
            axios.get(`https://badges.roblox.com/v1/users/${userId}/badges`),
            // Friends Count
            axios.get(`https://friends.roblox.com/v1/users/${userId}/friends/count`),
            // Groups/Komunitas
            axios.get(`https://groups.roblox.com/v1/users/${userId}/groups/roles`),
            // Status/Presence (POST request)
            axios.post(`https://presence.roblox.com/v1/presence/users`, { "userIds": [userId] })
        ]);

        // --- 4. Format Hasil ---
        const avatarData = avatarRes.data.data ? avatarRes.data.data[0] : {};
        const presenceInfo = presenceRes.data.userPresences ? presenceRes.data.userPresences[0] : {};

        const statusMap = {
            1: "Online", 2: "In Game", 3: "In Studio", 0: "Offline"
        };
        
        const result = {
            id: userId,
            username: userData.name,
            displayName: userData.displayName,
            description: userData.description || 'No bio',
            isBanned: userData.isBanned || false,
            hasVerifiedBadge: userData.hasVerifiedBadge || false,
            joinDate: formatDate(userData.created),
            
            avatarUrl: avatarData.imageUrl || null,
            
            stats: {
                friendsCount: friendsCountRes.data.count || 0,
                totalBadges: badgesRes.data.total || 0,
            },

            presence: {
                type: statusMap[presenceInfo.userPresenceType] || 'Unknown',
                lastOnline: presenceInfo.lastOnline || null,
                placeId: presenceInfo.placeId || null,
                rootPlaceId: presenceInfo.rootPlaceId || null,
                lastLocation: presenceInfo.lastLocation || null,
            },

            groups: groupsRes.data.data.map(g => ({
                id: g.group.id,
                name: g.group.name,
                role: g.role.name,
                memberCount: g.group.memberCount,
            })),
            
            profileUrl: `https://www.roblox.com/users/${userId}/profile`
        };

        return result;

    } catch (error) {
        console.error('Roblox Stalk Service Error:', error.message);
        
        let msg = 'Kesalahan saat menghubungi API Roblox.';
        if (error.response && error.response.status === 404) {
            msg = 'Akun Roblox tidak ditemukan (404 Not Found).';
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            msg = 'Permintaan ke API Roblox mengalami Timeout.';
        }
        
        return { error: msg };
    }
}
