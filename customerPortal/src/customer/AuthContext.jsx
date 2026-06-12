import React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }

        async function restoreSession() {
            try {
                const authRes = await api.me();

                if (authRes.user.role !== "customer") {
                    throw new Error("This portal is for customers only.");
                }

                setUser(authRes.user);
            } catch {
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    async function login(email, password) {
        const res = await api.login(email, password);

        if (res.user.role !== "customer") {
            throw new Error("This portal is for customers only.");
        }

        setToken(res.token);
        setUser(res.user);

        return res.user;
    }

    async function register(name, email, password) {
        const res = await api.register(name, email, password);

        if (res.user.role !== "customer") {
            throw new Error("This portal is for customers only.");
        }

        setToken(res.token);
        setUser(res.user);

        return res.user;
    }

    function logout() {
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
