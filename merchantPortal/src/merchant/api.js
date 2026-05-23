const TOKEN_KEY = "cs110_merchant_token";

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
        // Empty response body is fine.
    }

    if (!res.ok) {
        const message = data?.error || `Request failed (${res.status})`;
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

    register: (name, email, password) =>
        request("/auth/register", {
            method: "POST",
            body: { name, email, password, role: "merchant" },
            auth: false,
        }),

    updateMerchantProfile: (payload) =>
        request("/merchant/me", {
            method: "PATCH",
            body: payload,
        }),

    me: () => request("/auth/me"),

    merchantMe: () => request("/merchant/me"),

    listListings: () => request("/merchant/listings"),

    createListing: (payload) =>
        request("/merchant/listings", {
            method: "POST",
            body: payload,
        }),

    updateListing: (id, payload) =>
        request(`/merchant/listings/${id}`, {
            method: "PATCH",
            body: payload,
        }),

    deleteListing: (id) =>
        request(`/merchant/listings/${id}`, {
            method: "DELETE",
        }),

    listCategories: () => request("/categories"),

    publicListings: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/listings${qs ? `?${qs}` : ""}`, { auth: false });
    },
};