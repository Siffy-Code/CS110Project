// Tiny fetch wrapper that injects the JWT, parses JSON, and throws on errors.
const TOKEN_KEY = "cs110_admin_token";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = "GET", body, auth = true } = {}) {
    const headers = { "Content-Type": "application/json" };

    if (auth) {
        const token = getToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`/api${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        // Empty body is fine.
    }

    if (!res.ok) {
        const message = (data && data.error) || `Request failed (${res.status})`;
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }

    return data;
}

export const api = {
    login: (email, password) =>
        request("/auth/login", {
            method: "POST",
            body: { email, password },
            auth: false,
        }),
    me: () => request("/auth/me"),

    stats: () => request("/admin/stats"),

    listUsers: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/admin/users${qs ? `?${qs}` : ""}`);
    },
    deactivateUser: (id) =>
        request(`/admin/users/${id}/deactivate`, { method: "PATCH" }),
    reactivateUser: (id) =>
        request(`/admin/users/${id}/reactivate`, { method: "PATCH" }),
    resetPassword: (id, newPassword) =>
        request(`/admin/users/${id}/reset-password`, {
            method: "POST",
            body: { newPassword },
        }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE" }),

    listMerchants: () => request("/admin/merchants"),
    deactivateMerchant: (id) =>
        request(`/admin/merchants/${id}/deactivate`, { method: "PATCH" }),
    reactivateMerchant: (id) =>
        request(`/admin/merchants/${id}/reactivate`, { method: "PATCH" }),

    listListings: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/admin/listings${qs ? `?${qs}` : ""}`);
    },
    createListing: (payload) =>
        request("/admin/listings", { method: "POST", body: payload }),
    deactivateListing: (id, reason = "") =>
        request(`/admin/listings/${id}/deactivate`, {
            method: "PATCH",
            body: { reason },
        }),
    reactivateListing: (id) =>
        request(`/admin/listings/${id}/reactivate`, { method: "PATCH" }),
    deleteListing: (id) =>
        request(`/admin/listings/${id}`, { method: "DELETE" }),

    listCategories: () => request("/admin/categories"),
    createCategory: (name, description = "") =>
        request("/admin/categories", {
            method: "POST",
            body: { name, description },
        }),
    updateCategory: (id, payload) =>
        request(`/admin/categories/${id}`, {
            method: "PATCH",
            body: payload,
        }),
    deleteCategory: (id) =>
        request(`/admin/categories/${id}`, { method: "DELETE" }),

    listLogs: (limit = 100) => request(`/admin/logs?limit=${limit}`),
};
