// client/src/utils/authHeader.js
export default function authHeader() {
    const userStr = localStorage.getItem('user');
    let user = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            console.error("Error parsing user from localStorage in authHeader:", e);
            localStorage.removeItem('user'); // Clear corrupted data
            return {};
        }
    }

    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
}