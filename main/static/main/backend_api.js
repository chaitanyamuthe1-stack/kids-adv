// Small helper to call backend JSON endpoints. Falls back to localStorage if offline.

async function apiRegister(username, password, character = '👤') {
    try {
        const res = await fetch('/main/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, character })
        });
        return await res.json();
    } catch (e) {
        // fallback: localStorage
        const users = JSON.parse(localStorage.getItem('kids_learning_users') || '{}');
        if (users[username]) return { ok: false, error: 'User exists (local fallback)' };
        users[username] = { password, character, createdAt: new Date().toISOString(), stars: 0, chapterScores: {} };
        localStorage.setItem('kids_learning_users', JSON.stringify(users));
        return { ok: true, fallback: true };
    }
}

async function apiLogin(username, password) {
    try {
        const res = await fetch('/main/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await res.json();
    } catch (e) {
        const users = JSON.parse(localStorage.getItem('kids_learning_users') || '{}');
        const user = users[username];
        if (user && user.password === password) return { ok: true, user };
        return { ok: false, error: 'Offline and no local user match' };
    }
}

async function apiGetProgress(username) {
    try {
        const res = await fetch(`/main/api/progress/${encodeURIComponent(username)}/`);
        return await res.json();
    } catch (e) {
        const users = JSON.parse(localStorage.getItem('kids_learning_users') || '{}');
        return { ok: true, progress: users[username] || null, fallback: true };
    }
}

// Simple helper to POST progress
async function apiSaveProgress(username, data) {
    try {
        const res = await fetch('/main/api/progress/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, data })
        });
        return await res.json();
    } catch (e) {
        const users = JSON.parse(localStorage.getItem('kids_learning_users') || '{}');
        users[username] = Object.assign(users[username] || {}, data);
        localStorage.setItem('kids_learning_users', JSON.stringify(users));
        return { ok: true, fallback: true };
    }
}
