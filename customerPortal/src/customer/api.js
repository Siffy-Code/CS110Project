const TOKEN_KEY = "cs110_customer_token";

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
            body: { name, email, password, role: "customer" },
            auth: false,
        }),

    me: () => request("/auth/me"),

    // Public listings & categories
    publicListings: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/listings${qs ? `?${qs}` : ""}`, { auth: false });
    },

    publicCategories: () => request("/categories", { auth: false }),

    // Customer messages
    customerMessages: () =>
        request("/customer/messages"),

    customerConversation: (id) =>
        request(`/customer/messages/${id}`),

    createConversation: (payload) =>
        request("/customer/messages", {
            method: "POST",
            body: payload,
        }),

    sendCustomerMessage: (id, content) =>
        request(`/customer/messages/${id}`, {
            method: "POST",
            body: { content },
        }),

    // Customer orders
    customerOrders: () => request("/customer/orders"),

    placeOrder: (payload) =>
        request("/customer/orders", {
            method: "POST",
            body: payload,
        }),

    // Customer favorites
    customerFavorites: () => request("/customer/favorites"),

    addFavorite: (merchantId) =>
        request("/customer/favorites", {
            method: "POST",
            body: { merchantId },
        }),

    removeFavorite: (merchantId) =>
        request(`/customer/favorites/${merchantId}`, {
            method: "DELETE",
        }),
};
